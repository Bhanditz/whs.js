/**
 * © Alexander Buzin, 2014-2015
 * Site: http://alexbuzin.me/
 * Email: alexbuzin88@gmail.com
*/

/**
 * Init.
 *
 * @param {Object} params Parameters of initalize. (OPTIONAL)
 * @return {Object} Scope.
 */
WHS.init = class {

    constructor (params) {

        'use strict';

        console.log('WHS.init', WHS.REVISION);

        if (!THREE)
            console.warn('whitestormJS requires THREE.js. {Object} THREE not found.');
        if (!Physijs)
            console.warn('whitestormJS requires PHYSI.js. {Object} Physijs not found.');
        if (!WAGNER)
            console.warn('whitestormJS requires WAGNER.js. {Object} WAGNER not found.');

        var target = api.extend(params, {

            anaglyph: false,
            helper: false,
            stats: false,
            wagner: true,
            autoresize: false,

            shadowmap: true,

            gravity: {
                x: 0,
                y: 0,
                z: 0
            },

            camera: {
                aspect: 75,
                near: 1,
                far: 1000,

                x: 0,
                y: 0,
                z: 0
            },

            rWidth: window.innerWidth, // Resolution(width).
            rHeight: window.innerHeight, // Resolution(height).

            width: window.innerWidth, // Container(width).
            height: window.innerHeight, // Container(height).

            physics: {

                quatNormalizeSkip: 0,
                quatNormalizeFast: false,

                solver: {
                    iterations: 20,
                    tolerance: 0,
                },

                defMaterial: {
                    contactEquationStiffness: 1e8,
                    contactEquationRegularizationTime: 3
                }

            },

            background: 0x000000,
            assets: "./assets",
            container: document.body,

            path_worker: '../libs/physijs_worker.js',
            path_ammo: '../libs/ammo.js'

        });

        this._settings = target;

        Physijs.scripts.worker = target.path_worker;
        Physijs.scripts.ammo = target.path_ammo;

        this.scene = new Physijs.Scene;

        this.scene.setGravity(new THREE.Vector3(params.gravity.x, params.gravity.y, params.gravity.z));

        // DOM INIT
        var whselement = this._initDOM();

        this._initStats( whselement );
        this._initCamera();
        this._initRenderer( whselement );

        if (target.anaglyph) {

            this.effect = new THREE.AnaglyphEffect(this._renderer);
            this.effect.setSize(target.rWidth, target.rHeight);

            this.effect.render(this.scene, this._camera);

        }

        // NOTE: ==================== Composer. =======================
        if (target.wagner) {

            this._composer = new WAGNER.Composer(this._renderer);
            
            this._composer.setSize(target.rWidth, target.rHeight);
            this._composer.autoClearColor = true;

            this._composer.reset();
            this._composer.render(this.scene, this._camera);

            this._composer.eff = [];

        }

        Object.assign(this, {
            _settings: target,
            modellingQueue: [], // Queue for physics objects
            children: [], // Children for this app.
            _dom: whselement
        });

        // NOTE: ==================== Autoresize. ======================
        var scope = this;

        if (target.autoresize)
            window.addEventListener('load resize', function() {
                scope._camera.aspect = window.innerWidth / window.innerHeight;

                scope._camera.updateProjectionMatrix();

                scope._renderer.setSize(target.rWidth, target.rHeight);

                /*if (params.wagner) {
                    scope._composer.setSize(target.rWidth, target.rHeight);

                    renderer.domElement.style.width = '100%';
                    renderer.domElement.style.height = '100%';
                }*/
        });

        return scope;

    }

    _initDOM() {

        this._settings.container.style.margin = 0;
        this._settings.container.style.padding = 0;
        this._settings.container.style.position = 'relative';
        this._settings.container.style.overflow = 'hidden';

        var canvasParent = document.createElement('div');
        canvasParent.className = "whs";

        this._settings.container.appendChild(canvasParent);

        return canvasParent;

    }

    _initStats( element ) {

        // Debug Renderer
        if (this._settings.stats) {

            this._stats = new Stats();

            if (this._settings.stats == "fps")
                this._stats.setMode(0);

            else if (this._settings.stats == "ms")
                this._stats.setMode(1);

            else if (this._settings.stats == "mb")
                this._stats.setMode(1);

            else {
                this._stats.setMode(0);

                console.warn([this._stats], "Please, apply stats mode [fps, ms, mb] .");
            }

            this._stats.domElement.style.position = 'absolute';
            this._stats.domElement.style.left = '0px';
            this._stats.domElement.style.bottom = '0px';

            element.appendChild(this._stats.domElement);

        }

    }

    _initCamera() {

        this._camera = new THREE.PerspectiveCamera(
            this._settings.camera.aspect,
            this._settings.width / this._settings.height,
            this._settings.camera.near,
            this._settings.camera.far
        );

        this._camera.position.set(
            this._settings.camera.x,
            this._settings.camera.y,
            this._settings.camera.z
        );

        this.scene.add( this._camera );

    }

    _initRenderer( element ) {

        // Renderer.
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setClearColor(this._settings.background);

        // Shadowmap.
        this._renderer.shadowMap.enabled = this._settings.shadowmap;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.shadowMap.cascade = true;

        this._renderer.setSize(this._settings.rWidth, this._settings.rHeight);
        this._renderer.render(this.scene, this._camera);

        element.appendChild(this._renderer.domElement);

        this._renderer.domElement.style.width = '100%';
        this._renderer.domElement.style.height = '100%';

    }

    start() {

        'use strict';

        var clock = new THREE.Clock();
        var scope = this;
        scope._events = new Events();

        /*scope._events.on("ready", function() {
            scope.update();
        })*/

        function reDraw(time) {

            requestAnimationFrame(reDraw);

            // Init stats.
            if (scope._stats)
                 scope._stats.begin();

            // Merging data loop.
            for (var i = 0; i < scope.modellingQueue.length; i++) {
                if (scope.modellingQueue[i]._type == "morph") 
                    scope.modellingQueue[i].mesh.mixer.update( clock.getDelta() );
            }

            scope.scene.simulate();

            //if (scope._settings.anaglyph)
            //  scope.effect.render(scope.scene, scope._camera);

            // Controls.
            if (scope.controls) {
                scope.controls.update(Date.now() - scope.time);
                scope.time = Date.now();
            }

            // Effects rendering.
            if (scope._composer) {
                scope._composer.reset();

                scope._composer.render(scope.scene, scope._camera);

                scope._composer.eff.forEach(function(effect) {
                    scope._composer.pass(effect);
                })

                scope._composer.toScreen();
            }

            // End helper.
            if (scope._stats)
                scope._stats.end();

             WHS.loops.forEach( function(loop) {

                if(loop.enabled)
                    loop.func(time);
                
             });
        }

        this.update = reDraw;

        scope.update();

        /*scope._ready = [];

        var loading_queue = WHS.Watch(scope.children);

        loading_queue._queue.forEach(object => {
            object.ready.on("ready", function() {
               // object._state.then(() => {
                    scope._ready.push(object);

                    if(loading_queue._queue.length == scope._ready.length) 
                        scope._events.emit("ready");
                //});
            });

        });*/
    }

}

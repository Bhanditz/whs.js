/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAmbient = addAmbient;
exports.addBasicLights = addBasicLights;
exports.addPlane = addPlane;
exports.addBoxPlane = addBoxPlane;
var $world = exports.$world = {
  stats: 'fps', // fps, ms, mb or false if not need.
  autoresize: 'window',

  gravity: [0, -100, 0],

  camera: {
    position: [0, 10, 50]
  },

  rendering: {
    background: {
      color: 0x162129
    },

    renderer: {
      antialias: true
    }
  },

  shadowmap: {
    type: THREE.PCFSoftShadowMap
  }
};

var $colors = exports.$colors = {
  bg: 0x162129,
  plane: 0x447F8B,
  mesh: 0xF2F2F2,
  softbody: 0x434B7F
};

function addAmbient(world, intensity) {
  new WHS.AmbientLight({
    light: {
      intensity: intensity
    }
  }).addTo(world);
}

function addBasicLights(world) {
  var intensity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
  var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 10, 10];
  var distance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;

  addAmbient(world, 1 - intensity);

  return new WHS.PointLight({
    light: {
      intensity: intensity,
      distance: distance
    },

    shadowmap: {
      fov: 90
    },

    position: position
  }).addTo(world);
}

function addPlane(world) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  return new WHS.Plane({
    geometry: {
      width: size,
      height: size
    },

    modules: [new PHYSICS.PlaneModule({
      mass: 0
    })],

    material: new THREE.MeshPhongMaterial({ color: 0x447F8B }),

    rotation: {
      x: -Math.PI / 2
    }
  }).addTo(world);
}

function addBoxPlane(world) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  return new WHS.Box({
    geometry: {
      width: size,
      height: 1,
      depth: size
    },

    modules: [new PHYSICS.BoxModule({
      mass: 0
    })],

    material: new THREE.MeshPhongMaterial({ color: 0x447F8B })
  }).addTo(world);
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _globals = __webpack_require__(0);

var UTILS = _interopRequireWildcard(_globals);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

WHS.Component.prototype.changeColor = function (world) {
  var object = this,
      color = new THREE.Color();

  var animation = new WHS.Loop(function () {
    object.material.color = color;

    if (color.r <= 1) color.r += 0.01;
    if (color.g >= 0) color.g -= 0.01;
    if (color.b >= 0) color.b -= 0.01;
    if (color.r >= 1) {
      (function () {
        animation.stop(world);

        object.material.color.setRGB(1, 0, 0);

        var animation2 = new WHS.Loop(function () {
          object.material.color = color;
          if (color.r >= 0) color.r -= 0.01;
          if (color.g <= 1) color.g += 0.01;
          if (color.b >= 0) color.b -= 0.01;
          if (color.r <= 0 && color.g >= 1) {
            (function () {
              animation2.stop(world);

              object.material.color.setRGB(1, 0, 0);
              var animation3 = new WHS.Loop(function () {
                object.material.color = color;
                if (color.r >= 0) color.r -= 0.01;
                if (color.g >= 0) color.g -= 0.01;
                if (color.b <= 1) color.b += 0.01;
                if (color.g <= 0 && color.b >= 1) {
                  animation3.stop(world);

                  object.material.color.setRGB(0, 0, 1);
                  animation.start(world);
                }
              });

              animation3.start(world);
            })();
          }
        });

        animation2.start(world);
      })();
    }
  });

  animation.start(world);
};

var world = new (PHYSICS.$world(WHS.World))(_extends({}, UTILS.$world, {

  physics: {
    ammo: `${window.location.href}../../../vendor/ammo.js`
  },

  camera: {
    far: 10000,
    position: [0, 10, 30]
  }
}));

var torus = new WHS.Torus({
  geometry: {
    radius: 5,
    tube: 2
  },

  mass: 0,

  material: {
    color: UTILS.$colors.mesh,
    kind: 'phong'
  },

  position: {
    x: 0,
    y: 10,
    z: 0
  }
});

world.add(torus);

torus.changeColor(world);

UTILS.addBoxPlane(world, 250);
UTILS.addBasicLights(world);

world.setControls(new WHS.OrbitControls());
world.start();

/***/ }
/******/ ]);
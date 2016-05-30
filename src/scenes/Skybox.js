import {
	CubeGeometry,
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
	ImageUtils,
	BackSide
} from 'three';

import Shapre from '../core/Shape';

class Skybox extends Shape {
	constructor(params = {}) {
		super(params, 'skybox');

    WHS.API.extend(params, {
      skyType: "box",
      detail: ".png",
      radius: 10,
      fog: true,
      path: ''
    });

    let skyGeometry, skyMat;

		switch (params.skyType) {
      case 'box':
          let directions = ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg'];
					let matArray = [];

          skyGeometry = new CubeGeometry(params.radius, params.radius, params.radius);

          for (let i = 0; i < 6; i++) {
            matArray.push(new MeshBasicMaterial({
              map: ImageUtils.loadTexture(params.path + directions[i] + params.imgSuffix),
              side: BackSide,
              fog: params.fog
            }));
          }

          skyMat = new THREE.MeshFaceMaterial(matArray);

          break;
      case 'sphere':
        skyGeometry = new SphereGeometry(params.radius / 2, 60, 40);
        skyMat = new MeshBasicMaterial({
          map: ImageUtils.loadTexture(params.path + params.imgSuffix),
          side: BackSide,
          fog: params.fog
        });

				break;
			default:
    }

    let mesh = new THREE.Mesh( skyGeometry, skyMat );
    mesh.renderDepth = 1000.0;

    super.setNative( mesh );
    super.wrap();
	}
}

export {
	Skybox as default
};

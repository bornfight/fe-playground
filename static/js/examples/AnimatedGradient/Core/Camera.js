import { PerspectiveCamera } from "three";
export default class Camera {
  constructor({scene, sizes}) {
    this.sizes = sizes
    this.scene = scene

    this.camera = new PerspectiveCamera(75, this.sizes.width / this.sizes.height,  1, 1000);
    this.camera.position.set( 0, 0., 2.5 );


    this.scene.add(this.camera)

    return this.camera;
    // const helper = new THREE.CameraHelper( this.camera );
    // this.scene.add( helper );
  }
}
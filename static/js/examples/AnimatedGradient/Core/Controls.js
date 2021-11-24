import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Controls {
  constructor({camera, canvas}) {

    this.controls = new OrbitControls(camera, canvas)
    this.controls.enableDamping = false
    this.controls.enabled = false;
    this.controls.enableZoom = false;

    return this.controls;
  }
}

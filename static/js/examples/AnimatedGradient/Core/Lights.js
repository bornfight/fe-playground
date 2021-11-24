import { AmbientLight } from "three";
export default class Lights {
  constructor({scene, ambiantLight}) {
    this.scene = scene

    this.initAmbientLight(ambiantLight)
  }

  initAmbientLight(ambiantLight) {
    this.ambientLight = new AmbientLight(ambiantLight);
    this.scene.add(this.ambientLight)
  }
}
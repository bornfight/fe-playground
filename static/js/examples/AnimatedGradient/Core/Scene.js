import { Scene as ThreeScene, Color} from "three";

export default class Scene {
  constructor({background}) {
    this.scene = new ThreeScene()

    if(background) this.scene.background = new Color(background);

    return this.scene
  }
}

import {TextureLoader, RepeatWrapping} from "three"

export default class Textures {
    constructor({scene, textures}) {
        this.scene = scene

        this.textureLoader = new TextureLoader()
        this.textures = textures
        this.texturesLoaded = []

        this.init()

        return Promise.all(this.texturesLoaded).then((messages) => {
            return messages
        });
    }

    init() {
        this.textures.forEach((texture, index) => {
            this.texturesLoaded[index] = new Promise((resolve, reject) => {
                const done = (promise) => {
                    return resolve(promise)
                }
                const img = this.textureLoader.load(texture.src, done)
                if (texture.wrap) {
                    img.wrapS = RepeatWrapping;
                    img.wrapT = RepeatWrapping;
                    img.repeat.set(texture.wrap, texture.wrap);
                }
                return img
            })
        })
    }
}

import {PlaneGeometry, MeshStandardMaterial, Mesh, AdditiveBlending} from 'three'

export default class Noise {
  constructor({sizes, scene, image}) {
    this.sizes = sizes
    this.scene = scene
    this.image = image

    this.width =  16
    this.height =  13
    this.segments = 1

    this.grainIntensity = {value: 0.09}

    this.geometry = new PlaneGeometry(this.width, this.height, this.segments, this.segments)
    this.material = new MeshStandardMaterial({
      map: this.image,
      transparent: true,
      opacity: this.grainIntensity.value,
      blending: AdditiveBlending,
      depthWrite: false,
      depthTest: false
    })
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.z = 1.
    this.scene.add(this.mesh)
  }

  controls(gui) {
    gui.add(this.material, 'opacity').min(0).max(1).step(0.01).name('Grain Intensity').onChange()
  }

}
import {PlaneGeometry, ShaderMaterial, Vector2, Mesh} from 'three'

import gsap from 'gsap';
import { getRandomArbitrary } from '../helpers';

import GradientVertex from '../shaders/logo/vertex.js'
import GradientFragment from '../shaders/logo/fragment.js'

class Logo {
  constructor({sizes, scene, image, colors, gpuTier}) {
    // super({sizes, scene, noPlane: true})
    this.sizes = sizes
    this.scene = scene
    this.image = image

    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.gpuTier = gpuTier

    this.colorsThree = colors
    this.color = "dark";
    this.colors =  Object.assign({}, this.colorsThree[this.color] )
    this.time = getRandomArbitrary(-50, 50)
    this.width =  5 / 574 * 100
    this.height =  5 / 574 * 100
    this.segments = 1
    this.speedBlob = {value: 20}
    this.speedColor = {value: 20}
    this.colorStep = {value: new Vector2(0.63, .71)}
    this.meshes = []

    this.geometry = new PlaneGeometry(this.width, this.height, this.segments, this.segments)
    this.material = new ShaderMaterial({
      transparent: true,
      // blending: AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: {value: this.time},
        uSpeedBlob: this.speedBlob,
        uLowGpu: {value: this.isSafari || this.gpuTier?.tier < 2},
        uSpeedColor: this.speedColor,
        uAmplitude: {value: 100},
        uTexture: { value: this.image },
        uResolution: {value: new Vector2(this.sizes.width, this.sizes.height)},
        uOpacity: {value: 0},
        uColor1: {value: this.colors[0] },
        uColor2: {value: this.colors[1] },
        uColor3: {value: this.colors[2] },
        uColor4: {value: this.colors[3] },
        uColor5: {value: this.colors[4] },
        uColor6: {value: this.colors[5] },
        uWhiteness: { value: 5 }, // 0.45,
        uStep: this.colorStep
      },
      vertexShader: GradientVertex,
      fragmentShader: GradientFragment,
    })
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.z = 1.
    this.mesh.scale.set(.8, .8, 1)
    this.scene.add(this.mesh)


    this.onPlay()
  }

  onPlay() {
    const duration = 1.
    const tl = gsap.timeline({
      delay: .6,
    })
    tl.to(this.material.uniforms.uOpacity, {
      value: 1,
      duration: .8,
      ease: 'power3.out',
    })
    .to(this.mesh.scale, {
      x: .9,
      y: .9,
      duration: .8,
    }, "-=.8")
    .to(this.material.uniforms.uOpacity, {
      value: 1,
      duration: .2,
      ease: 'power3.out',
    })
    .to(this.mesh.scale, {
      x: 1.9,
      y: 1.9,
      duration: duration,
    }, "-=.4")
    .to(this.material.uniforms.uWhiteness, {
      value: .15,
      duration: .6,
      ease: 'power3.out',
    }, "-=.8")
    .to(this.material.uniforms.uOpacity, {
      value: 0,
      duration: .4,
      ease: 'power4.in',
      onComplete:() => {
        const event = new CustomEvent('loaded')
        document.dispatchEvent(event);
        this.removeMesh()
      }
    }, `-=${duration - .6}`)
  }
  // controls(gui) {
  //   gui.add(this.mesh.material.uniforms.uWhiteness, 'value').min(0).max(5).step(0.01).onChange().name('uWhiteness')
  //   gui.add(this.mesh.material.uniforms.fresnelBias, 'value').min(0).max(5).step(0.01).onChange().name('fresnelBias')
  //   gui.add(this.mesh.material.uniforms.fresnelPower, 'value').min(0).max(5).step(0.01).onChange().name('fresnelPower')
  //   gui.add(this.mesh.material.uniforms.fresnelScale, 'value').min(0).max(5).step(0.01).onChange().name('fresnelScale')
  //   gui.add(this.mesh.material.uniforms.fresnelIntesity, 'value').min(0).max(1).step(0.01).onChange().name('fresnelIntesity')
  // }
  removeMesh() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove( this.mesh );
  }
}

export default Logo

import {Vector3, Vector2, Mesh, PlaneGeometry, ShaderMaterial} from "three";

import gsap from "gsap";

import GradientFragment from "./shaders/fragment";
import GradientVertex from "./shaders/vertex";

export default class Shape {
    constructor({sizes, scene, colors, gpuTier}) {
        this.color = "dark";
        this.colorsThree = colors;
        this.colors = Object.assign({}, this.colorsThree[this.color]);
        this.sizes = sizes;
        this.scene = scene;

        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.width = 16;
        this.height = 13;

        this.isLow = gpuTier?.tier < 3 || this.isSafari;
        this.isVeryLow = gpuTier?.tier < 2 || (this.isSafari && gpuTier?.tier < 3);

        this.segments = this.isLow ? 200 : 600;
        this.segments = this.isVeryLow ? 100 : this.segments;
        this.time = -5;
        this.speedBlob = {value: 20};
        this.speedColor = {value: 20};
        this.amplitude = {value: 100};
        this.elevation = {value: new Vector3(0)};
        this.colorStep = {value: new Vector2(0.63, 0.71)};

        this.init();
    }

    init() {
        this.onReset();

        this.geometry = this.setGeometry();
        this.material = this.setMaterial();
        this.mesh = new Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        gsap.to(this.material.uniforms.uOpacity, {
            value: 1,
            delay: 1.6,
            duration: 2,
            ease: "power3.out",
        });
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }


    setGeometry() {
        return new PlaneGeometry(this.width, this.height, this.segments, this.segments);
    }

    setMaterial() {
        return new ShaderMaterial({
            uniforms: {
                uTime: {value: this.time},
                uSpeedBlob: this.speedBlob,
                uSpeedColor: this.speedColor,
                uLowGpu: {value: this.isLow},
                uVeryLowGpu: {value: this.isVeryLow},
                uResolution: {value: new Vector2(this.sizes.width / 2, this.sizes.height / 2)},
                uColor1: {value: this.colors[0]},
                uColor2: {value: this.colors[1]},
                uColor3: {value: this.colors[2]},
                uColor4: {value: this.colors[3]},
                uColor5: {value: this.colors[4]},
                uColor6: {value: this.colors[5]},
                uAmplitude: this.amplitude,
                uElevation: this.elevation,
                uOpacity: {value: 0},
                fresnelBias: {value: 0},
                fresnelPower: {value: 0.68},
                fresnelScale: {value: 4.68},
                fresnelIntesity: {value: 0.1},
                uStep: this.colorStep,
            },
            transparent: true,
            vertexShader: GradientVertex,
            fragmentShader: GradientFragment,
        });
    }

    onReset() {
        if (this.mesh) {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.mesh);
        }
    }
}

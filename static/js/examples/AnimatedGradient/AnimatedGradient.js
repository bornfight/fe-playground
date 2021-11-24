// import { getGPUTier } from 'detect-gpu';
import {Clock, Color} from "three";

import Camera from "./Core/Camera";
import Controls from "./Core/Controls";
import Lights from "./Core/Lights";
import Renderer from "./Core/Renderer";
import Scene from "./Core/Scene";
import Textures from "./Core/Textures";
// import Stats from 'stats-js'

import Plane from "./shapes/Plane";
import Logo from "./shapes/Logo";
import Noise from "./shapes/Noise";

/**
 * Base
 */
const clock = new Clock();
// const stats = new Stats();
// stats.showPanel( 0 );
// document.body.appendChild( stats.dom );

export default class AnimatedGradient {
    constructor() {
        // Helpers
        this.isMobile = window.innerWidth < 1024;
        this.pixelRatio = 1.5;
        this.wrap = 20;
        this.light = ["#93a0D7", "#FFB648", "#ff4720", "#506eff", "#e3593c", "#F9F5E3"];
        this.dark = ["#00032d", "#f70000", "#ffa800", "#fc4c35", "#79ffce", "#0808c6"];
        this.colorsList = {
            light: "Light",
            dark: "Dark",
        };
        this.colorsThree = {
            light: this.light.map((color) => {
                return new Color(color);
            }),
            dark: this.dark.map((color) => {
                return new Color(color);
            }),
        };
        // Size
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.onResize = this.onResize.bind(this);
        // this.gui = new dat.GUI()

        /**
         * Dom Elements
         */

        // Canvas
        this.canvas = document.querySelector("#scene");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Scene
        this.scene = new Scene({background: 0x00032d});

        /**
         * Lights
         */
        this.ambiantLight = new Lights({
            scene: this.scene,
            ambiantLight: [0xffffff, 1],
        });

        /**
         * Texture Loader
         */
        this.textureLoaded = new Textures({
            scene: this.scene,
            textures: [
                {
                    src: document.querySelector('.js-img-1').src,
                },
                {
                    src: document.querySelector('.js-img-2').src,
                    wrap: 20,
                },
            ],
        });

        this.textureLoaded.then((promise) => {
            this.textures = promise;
            this.initScene();

            // return getGPUTier({
            //     // glContext: !this.isMobile ? this.renderer.getContext() : null,
            //     // mobileTiers: [20, 30, 30, 20],
            //     desktopTiers: [15, 35, 56, 58],
            // });
            // Actions
        })
            .then((promise) => {
                this.gpu = promise;
                this.buildScene();
                this.bindEvents();
                this.update();
            });
    }

    initScene() {
        this.camera = new Camera({
            scene: this.scene,
            sizes: this.sizes,
        });

        this.controls = new Controls({
            camera: this.camera,
            canvas: this.canvas,
        });

        this.renderer = new Renderer({
            scene: this.scene,
            sizes: this.sizes,
            canvas: this.canvas,
            pixelRatio: this.pixelRatio,
        });
        this.renderer.render(this.scene, this.camera);
    }

    buildScene() {
        this.logo = new Logo({
            sizes: this.sizes,
            scene: this.scene,
            colors: this.colorsThree,
            image: this.textures[0],
        });

        this.shape = new Plane({
            sizes: this.sizes,
            scene: this.scene,
            colors: this.colorsThree,
            gpuTier: this.gpu,
        });

        // this.colorDark = Object.assign({}, this.shape.colorsThree['dark'][5])
        // this.colorLight = Object.assign({}, this.shape.colorsThree['light'][5])

        this.noise = new Noise({
            image: this.textures[1],
            sizes: this.sizes,
            scene: this.scene,
        });
    }

    bindEvents() {
        window.addEventListener("resize", this.onResize);

        // document.addEventListener('updateColors', (evt) => {
        //   const { detail } = evt
        //   if(this.shape.color === detail.color || !detail.color) return

        //   gsap.to(this.shape.mesh.material.uniforms.uColor6.value, {
        //     r: detail.color === "light" ? colorLight.r : colorDark.r,
        //     g: detail.color === "light" ? colorLight.g : colorDark.g,
        //     b: detail.color === "light" ? colorLight.b : colorDark.b,
        //   })

        //   this.shape.color = detail.color
        // })
    }

    update() {
        const elapsedTime = clock.getElapsedTime();

        const finalTime = elapsedTime + this.shape.time;
        this.shape.mesh.material.uniforms.uTime.value = finalTime;

        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        // Call update again on the next frame
        window.requestAnimationFrame(this.update.bind(this));
    }

    /**
     * Actions
     */
    onResize() {
        // Update sizes
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.pixelRatio));
    }

    /**
     * Animations
     */
}

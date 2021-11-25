import {getGPUTier} from "detect-gpu";
import {Clock, Color} from "three";

import Camera from "./Core/Camera";
import Lights from "./Core/Lights";
import Renderer from "./Core/Renderer";
import Scene from "./Core/Scene";

import Plane from "./Plane";

/**
 * Base
 */
const clock = new Clock();

export default class AnimatedGradient {
    constructor() {
        // Helpers
        this.isMobile = window.innerWidth < 1024;
        this.pixelRatio = 1.5;
        this.wrap = 20;
        this.light = ["#93a0D7", "#FFB648", "#ff4720", "#506eff", "#e3593c", "#F9F5E3"];
        this.dark = ["#55532d", "#f70000", "#ffa800", "#fc4c35", "#79ffce", "#0808c6"];
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

        /**
         * Dom Elements
         */

        // Canvas
        this.canvas = document.querySelector("#scene");

        if (this.canvas == null) {
            return;
        }

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

        const waitForGPUTier = new Promise((resolve, reject) => {
            this.initScene();

            const promise = getGPUTier({
                // glContext: !this.isMobile ? this.renderer.getContext() : null,
                // mobileTiers: [20, 30, 30, 20],
                desktopTiers: [15, 35, 56, 58],
            });
            resolve(promise);
        });

        waitForGPUTier.then((promise) => {
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

        this.renderer = new Renderer({
            scene: this.scene,
            sizes: this.sizes,
            canvas: this.canvas,
            pixelRatio: this.pixelRatio,
        });
        this.renderer.render(this.scene, this.camera);
    }

    buildScene() {
        const event = new CustomEvent('loaded')
        document.dispatchEvent(event);

        this.shape = new Plane({
            sizes: this.sizes,
            scene: this.scene,
            colors: this.colorsThree,
            gpuTier: this.gpu,
        });
    }

    bindEvents() {
        window.addEventListener("resize", this.onResize);
    }

    update() {
        const elapsedTime = clock.getElapsedTime();

        const finalTime = elapsedTime + this.shape.time;
        this.shape.mesh.material.uniforms.uTime.value = finalTime;

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
}

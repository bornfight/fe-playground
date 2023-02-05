import { WebGLRenderer } from "three";

export default class Renderer {
    constructor({ sizes, canvas, pixelRatio }) {
        this.renderer = new WebGLRenderer({
            canvas: canvas,
            powerPreference: "high-performance",
            antialias: false,
        });

        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));

        return this.renderer;
    }
}

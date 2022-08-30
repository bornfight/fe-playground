import gsap from "gsap";
import * as PIXI from "pixi.js";

/**
 * Magnetic Cta class
 */
class MagneticCta {
    constructor(element, innerElement) {
        this.innerEl = element.querySelectorAll(innerElement);
        this.innerText = element.querySelectorAll("div");

        element.addEventListener("mousemove", (ev) => {
            ev.currentTarget.classList.add("is-active");
            this.mousemoveFn(ev, element);
        });

        element.addEventListener("mouseleave", (ev) => {
            ev.currentTarget.classList.remove("is-active");
            this.mouseleaveFn(ev, element);
        });
    }

    mousemoveFn(ev, element) {
        // Get X-coordinate for the left button edge
        const buttonPosX = element.getBoundingClientRect().left;
        const buttonPosY = element.getBoundingClientRect().top;

        // Get position of the mouse inside element from left edge
        // (current mouse X position - button x coordinate)
        const pageX = ev.clientX;
        const pageY = ev.clientY;

        const xPosOfMouse = pageX - buttonPosX;
        const yPosOfMouse = pageY - buttonPosY;

        // Get position of mouse relative to button center
        // Mouse position inside element - button width / 2
        // To get positive or negative movement
        const xPosOfMouseInsideButton = xPosOfMouse - element.offsetWidth / 2;
        const yPosOfMouseInsideButton = yPosOfMouse - element.offsetHeight / 2;

        // Button text divider to increase or decrease text path
        const animationDivider = 3;
        const animationDividerText = 1.5;

        // Animate button text positive or negative from center
        gsap.to(this.innerEl, {
            duration: 0.3,
            x: xPosOfMouseInsideButton / animationDivider,
            y: yPosOfMouseInsideButton / animationDivider,
            ease: "power3.out",
        });

        if (this.innerText.length > 0) {
            gsap.to(this.innerText, {
                duration: 0.2,
                x: xPosOfMouseInsideButton / animationDividerText,
                y: yPosOfMouseInsideButton / animationDividerText,
                ease: "power3.out",
            });
        }
    }

    // On mouse leave
    mouseleaveFn() {
        // Animate button text reset to initial position (center)
        gsap.to(this.innerEl, {
            duration: 0.3,
            x: 0,
            y: 0,
            ease: "power3.out",
        });

        if (this.innerText.length > 0) {
            gsap.to(this.innerText, {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: "power3.out",
            });
        }
    }
}

/**
 * Hotspots class
 */
class Hotspots {
    /**
     *
     * @param options
     */
    constructor(options) {
        /**
         *
         * @type {{hotspotText: string, hotspot: string, hotspotCircle: string, hotspotCanvasContainer: string, hotspotContainer: string}}
         * @private
         */
        const _defaults = {
            hotspotContainer: ".js-hotspot-container",
            hotspot: ".js-hotspot",
            hotspotCanvasContainer: ".js-hotspot-lines-container",
            hotspotCircle: ".js-hotspot-circle",
            hotspotText: ".js-hotspot-text",
        };

        this.defaults = Object.assign({}, _defaults, options);

        if (this.hotspotContainer) {
            this.init();
            this.initHotspotLines();
        }
    }

    /**
     *
     * @returns {NodeListOf<Element>}
     */
    get hotspotContainer() {
        return document.querySelectorAll(this.defaults.hotspotContainer);
    }

    /**
     *
     * @returns {NodeListOf<Element>}
     */
    get hotspotCanvasContainer() {
        return document.querySelectorAll(this.defaults.hotspotCanvasContainer);
    }

    init() {
        console.log("Hotspots init()");
    }

    initHotspotLines() {
        const lineColor = 0xb1b1b1;
        const lineGradient = ["#b1b1b1", "#ffffff"];
        const lineEndingRadius = 2;

        const gradientTexture = this.getGradientTexture(lineGradient[0], lineGradient[1]);

        this.hotspotContainer.forEach((hotspotContainer) => {
            const hotspots = hotspotContainer.querySelectorAll(this.defaults.hotspot);

            // CANVAS SIZE
            const canvasWidth = hotspotContainer.clientWidth;
            const canvasHeight = hotspotContainer.clientHeight;

            // CREATE PIXI APPLICATION
            const app = new PIXI.Application({
                width: canvasWidth,
                height: canvasHeight,
                antialias: true,
                transparent: true,
                //resolution: window.devicePixelRatio,
                resizeTo: hotspotContainer,
            });

            // ADD CANVAS TO CANVAS WRAPPER ELEMENT
            hotspotContainer.appendChild(app.view);

            hotspots.forEach((hotspot) => {
                const circle = hotspot.querySelector(this.defaults.hotspotCircle);
                const text = hotspot.querySelector(this.defaults.hotspotText);

                const line = new PIXI.Graphics();
                line.alpha = 0;

                app.stage.addChild(line);

                app.ticker.add(() => {
                    line.clear();
                    line.beginFill(lineColor, 1);
                    line.drawCircle(this.getPosition(circle)[0], this.getPosition(circle)[1], lineEndingRadius);
                    line.endFill();
                    line.beginFill(lineColor, 1);
                    line.drawCircle(this.getPosition(text)[0], this.getPosition(text)[1], lineEndingRadius);
                    line.endFill();
                    line.moveTo(this.getPosition(circle)[0], this.getPosition(circle)[1]);
                    line.lineStyle(1, lineColor, 1);
                    line.lineTextureStyle({
                        width: 1,
                        texture: gradientTexture,
                        color: 0xffffff,
                    });
                    line.lineTo(this.getPosition(text)[0], this.getPosition(text)[1]);
                });

                //hover
                hotspot.addEventListener("mouseenter", () => {
                    gsap.to(line, {
                        alpha: 1,
                        duration: 0.4,
                        onComplete: () => {},
                    });
                });

                hotspot.addEventListener("mouseleave", () => {
                    gsap.to(line, {
                        alpha: 0,
                        duration: 0.4,
                        onComplete: () => {},
                    });
                });
            });
        });
    }

    /**
     *
     * @param {HTMLElement} element - element which position we should get
     * @returns {[number, number]} - position of element relative to viewport
     */
    getPosition(element) {
        const posX =
            element.getBoundingClientRect().left -
            element.closest(this.defaults.hotspotContainer).getBoundingClientRect().left +
            element.clientWidth / 2;

        const posY =
            element.getBoundingClientRect().top -
            element.closest(this.defaults.hotspotContainer).getBoundingClientRect().top +
            element.clientHeight / 2;

        return [posX, posY];
    }

    /**
     *
     * @param {string} from - color in hex format
     * @param {string} to - color in hex format
     * @returns {PIXI.Texture}
     */
    getGradientTexture(from, to) {
        const textureWH = 300;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const gradient = context.createLinearGradient(0, 0, textureWH, textureWH);
        gradient.addColorStop(0, from);
        gradient.addColorStop(1, to);
        context.fillStyle = gradient;
        context.fillRect(0, 0, textureWH, textureWH);

        return new PIXI.Texture.from(canvas);
    }
}

export default class MagneticHotspots {
    constructor() {
        const magneticCta = document.querySelectorAll(".js-hotspot");

        magneticCta.forEach((element) => {
            new MagneticCta(element, "span");
        });

        new Hotspots();
    }
}

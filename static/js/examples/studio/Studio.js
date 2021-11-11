import { gsap } from "gsap/dist/gsap";

/**
 * Template component
 * explain what this class is doing
 */
export default class Studio {
    constructor() {
        /**
         *
         * @type {{letter: string, letterAlt: string}}
         */
        this.DOM = {
            studio: ".js-studio",
            letter: ".js-letter-initial",
            letterAlt: ".js-letter-alt",
        };

        /**
         *
         * @type {Element}
         */
        this.studio = document.querySelector(this.DOM.studio);
        /**
         *
         * @type {NodeListOf<Element>}
         */
        this.letters = document.querySelectorAll(this.DOM.letter);

        /**
         *
         * @type {NodeListOf<Element>}
         */
        this.lettersAlt = document.querySelectorAll(this.DOM.letterAlt);
    }

    /**
     * Init
     */
    init() {
        if (this.studio === null) {
            return;
        }

        this.studioHover();
    }

    /**
     *
     */
    studioHover() {
        gsap.set(this.lettersAlt, {
            autoAlpha: 0,
        });

        const studioTimeline = gsap.timeline({
            paused: true,
        });

        const duration = 0.01;
        const each = 0.15;

        studioTimeline
            .add("start")
            .to(
                this.lettersAlt,
                {
                    autoAlpha: 1,
                    duration: duration,
                    stagger: {
                        from: "random",
                        each: each,
                    },
                },
                "start",
            )
            .to(
                this.letters,
                {
                    autoAlpha: 0,
                    duration: duration,
                    stagger: {
                        from: "random",
                        each: each,
                    },
                },
                "start",
            );

        this.studio.addEventListener("mouseenter", () => {
            studioTimeline.timeScale(1).play();
        });

        this.studio.addEventListener("mouseleave", () => {
            studioTimeline.timeScale(2).reverse();
        });
    }
}

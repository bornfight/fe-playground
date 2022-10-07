import { gsap } from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default class AimeConcept {
    constructor() {
        this.DOM = {
            component: ".js-aime-concept",
            titleLine1: ".js-aime-concept-title-line-1",
            titleLine2: ".js-aime-concept-title-line-2",
            blurCircle: ".js-aime-concept-circle-blur",
            gradientCircle: ".js-aime-concept-circle-gradient",
            states: {
                isActive: "is-active",
            },
        };

        this.component = document.querySelector(this.DOM.component);
    }

    /**
     * Init
     */
    init() {
        if (this.component !== null) {
            this.setup();
        }
    }

    setup() {
        console.log("Aime");
        const titleLine1 = this.component.querySelector(this.DOM.titleLine1);
        const titleLine2 = this.component.querySelector(this.DOM.titleLine2);
        const blurCircle = this.component.querySelector(this.DOM.blurCircle);
        const gradientCircle = this.component.querySelector(this.DOM.gradientCircle);

        let tl = gsap.timeline({
            paused: true,
        });
        let circleTl = gsap.timeline({
            // paused: true,
        });

        tl.to(titleLine2, {
            duration: 0.7,
            delay: 2,
            text: "M",
            ease: "power2",
        })
            .to(titleLine2, {
                duration: 0.7,
                text: "Messaging",
                ease: "power2",
            })
            .to(
                titleLine1,
                {
                    duration: 1,
                    text: "A",
                    ease: "power2",
                },
                "-=0.5",
            )
            .to(titleLine1, {
                duration: 0,
                text: "AI",
                ease: "power2",
            });

        circleTl
            .add("start")
            .fromTo(
                blurCircle,
                {
                    rotate: 0,
                    xPercent: -50,
                    yPercent: -25,
                },
                {
                    rotate: 365,
                    xPercent: 0,
                    yPercent: 0,
                    duration: 2,
                },
            )
            .fromTo(
                gradientCircle,
                {
                    rotate: 0,
                    xPercent: 35,
                    yPercent: 0,
                },
                {
                    rotate: 365,
                    xPercent: 0,
                    yPercent: 0,
                    duration: 2,
                },
                "start",
            );
    }
}

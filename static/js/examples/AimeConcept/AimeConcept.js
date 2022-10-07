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
            blurCircleWrapper: ".js-aime-concept-circle-blur-wrapper",
            gradientCircle: ".js-aime-concept-circle-gradient",
            gradientCircleWrapper: ".js-aime-concept-circle-gradient-wrapper",
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
        const blurCircleWrapper = this.component.querySelector(this.DOM.blurCircleWrapper);
        const gradientCircle = this.component.querySelector(this.DOM.gradientCircle);
        const gradientCircleWrapper = this.component.querySelector(this.DOM.gradientCircleWrapper);

        let tl = gsap.timeline({
            delay: 2,
            // paused: true,
        });
        let circleTl = gsap.timeline({
            // paused: true,
            delay: 2,
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
                blurCircleWrapper,
                {
                    rotate: 0,
                },
                {
                    rotate: 180,
                    duration: 2,
                    ease: "power2.in",
                },
                "start",
            )
            .fromTo(
                blurCircle,
                {
                    rotate: 0,
                    xPercent: 0,
                    yPercent: 0,
                },
                {
                    rotate: 180,
                    xPercent: 48,
                    yPercent: 48,
                    duration: 2,
                    ease: "power2.in",
                },
                "start",
            )
            .fromTo(
                gradientCircle,
                {
                    rotate: 0,
                    xPercent: 0,
                    yPercent: 0,
                },
                {
                    rotate: 180,
                    xPercent: -48,
                    yPercent: -48,
                    duration: 2,
                    ease: "power2.in",
                },
                "start",
            )
            .to(
                gradientCircleWrapper,
                {
                    rotate: 180,
                    duration: 2,
                    ease: "power2.in",
                },
                "start",
            )
            .add("half")
            // .addPause()
            .to(
                blurCircleWrapper,
                {
                    rotate: 360,
                    duration: 2,
                    ease: "power2.out",
                },
                "half",
            )
            .to(
                blurCircle,
                {
                    rotate: 0,
                    xPercent: -20,
                    yPercent: 50,
                    duration: 2,
                    ease: "power2.out",
                },
                "half",
            )
            .to(
                gradientCircle,
                {
                    rotate: 0,
                    xPercent: 20,
                    yPercent: -50,
                    duration: 2,
                    ease: "power2.out",
                },
                "half",
            )
            .to(
                gradientCircleWrapper,
                {
                    rotate: 360,
                    duration: 2,
                    ease: "power2.out",
                },
                "half",
            )
            .to(
                blurCircle,
                {
                    opacity: 0.5,
                    duration: 1,
                    ease: "power2.out",
                },
                "-=1",
            )
            .set(
                gradientCircleWrapper,
                {
                    zIndex: 2,
                },
                "-=1",
            );
    }
}

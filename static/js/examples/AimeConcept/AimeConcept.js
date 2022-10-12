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
            blurCircleWrapper: ".js-aime-concept-circle-blur-wrapper",
            blurCircleWrapperInner: ".js-aime-concept-circle-blur-wrapper-inner",
            gradientCircleWrapper: ".js-aime-concept-circle-gradient-wrapper",
            gradientCircleWrapperInner: ".js-aime-concept-circle-gradient-wrapper-inner",
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
        const titleLine1 = this.component.querySelector(this.DOM.titleLine1);
        const titleLine2 = this.component.querySelector(this.DOM.titleLine2);
        const blurCircle = this.component.querySelector(this.DOM.blurCircle);
        const blurCircleWrapper = this.component.querySelector(this.DOM.blurCircleWrapper);
        const gradientCircle = this.component.querySelector(this.DOM.gradientCircle);
        const gradientCircleWrapper = this.component.querySelector(this.DOM.gradientCircleWrapper);

        let tl = gsap.timeline({
            delay: 0.5,
            // paused: true,
        });
        let circleTl = gsap.timeline({
            // paused: true,
            delay: 0.5,
            onComplete: () => this.mouseMoveSetup(gradientCircle, blurCircle),
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
                    text: "AI",
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
                [blurCircleWrapper, gradientCircleWrapper],
                {
                    rotate: 0,
                },
                {
                    rotate: 180,
                    duration: 1,
                    ease: "sine.in",
                },
                "start",
            )
            .fromTo(
                blurCircle,
                {
                    xPercent: 20,
                    yPercent: 40,
                },
                {
                    xPercent: 48,
                    yPercent: 48,
                    duration: 1,
                    ease: "sine.in",
                },
                "start",
            )
            .fromTo(
                gradientCircle,
                {
                    rotate: 0,
                    xPercent: -20,
                    yPercent: -40,
                },
                {
                    rotate: 180,
                    xPercent: -48,
                    yPercent: -48,
                    duration: 1,
                    ease: "sine.in",
                },
                "start",
            )
            .add("half")
            // .addPause()
            .to(
                [blurCircleWrapper, gradientCircleWrapper],
                {
                    rotate: 720,
                    duration: 3,
                    ease: "power1.out",
                },
                "half",
            )
            .to(
                blurCircle,
                {
                    rotate: 0,
                    xPercent: -40,
                    yPercent: 50,
                    duration: 2.4,
                    ease: "back.out(1.8)",
                },
                "half",
            )
            .to(
                gradientCircle,
                {
                    rotate: 0,
                    xPercent: 40,
                    yPercent: -50,
                    duration: 2.4,
                    ease: "back.out(1.8)",
                },
                "half",
            )
            .set(
                gradientCircleWrapper,
                {
                    zIndex: 0,
                },
                "half+=1",
            )
            .set(
                blurCircleWrapper,
                {
                    zIndex: 2,
                },
                "-=1",
            );
    }

    mouseMoveSetup(gradientCircle, blurCircle) {
        const gradientCircleWrapperInner = this.component.querySelector(this.DOM.gradientCircleWrapperInner);
        const blurCircleWrapperInner = this.component.querySelector(this.DOM.blurCircleWrapperInner);

        const gradientCircleRect = gradientCircle.getBoundingClientRect();
        const blurCircleRect = blurCircle.getBoundingClientRect();
        document.addEventListener("mousemove", (e) => {
            gsap.to(gradientCircleWrapperInner, {
                x: ((e.clientX - gradientCircleRect.left) / gradientCircleRect.left) * -40,
                y: ((e.clientY - gradientCircleRect.top) / gradientCircleRect.top) * -40,
            });

            gsap.to(blurCircleWrapperInner, {
                x: ((e.clientX - blurCircleRect.left) / blurCircleRect.left) * -10,
                y: ((e.clientY - blurCircleRect.top) / blurCircleRect.top) * -10,
            });
        });
    }
}

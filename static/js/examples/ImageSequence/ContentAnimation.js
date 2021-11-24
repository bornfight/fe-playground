import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class ContentAnimation {
    constructor(resolve) {
        this.DOM = {
            content: ".js-sequence-step-content",
            step: ".js-sequence-step",
        };

        this.resolve = resolve;
    }

    init() {
        this.steps = document.querySelectorAll(this.DOM.step);

        if (this.steps.length < 1) {
            return;
        }

        this.steps.forEach((step) => {
            this.singleStep(step);
        });
    }

    singleStep(step) {
        const content = step.querySelector(this.DOM.content);

        gsap.set(content, {
            autoAlpha: 0,
            y: "100%"
        });

        let tl = gsap
            .timeline({
                scrollTrigger: {
                    trigger: step,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    pin: true,
                },
                onStart: () => {
                    this.resolve();
                }
            })
            .to(content, {
                duration: 1,
                y: "0%",
                autoAlpha: 1,
            })
            .to(content, {
                // y: "-100%",
                autoAlpha: 0,
            });
    }

}

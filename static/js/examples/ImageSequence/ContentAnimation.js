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

        this.resolve();
    }

    singleStep(step) {
        const content = step.querySelector(this.DOM.content);

        if (content == null) {
            return;
        }

        gsap.set(content, {
            autoAlpha: 0,
            y: "5vh"
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
            })
            .to(content, {
                duration: 1,
                y: "0vh",
                autoAlpha: 1,
            })
            .to(content, {
                y: "-2.5vh",
                autoAlpha: 0,
            });
    }

}

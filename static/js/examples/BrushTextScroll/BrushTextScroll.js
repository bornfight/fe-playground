import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class BrushTextScroll {
    constructor() {
        this.DOM = {
            wrapper: ".js-brush-text-scroll",
            text: ".js-text-line",
            mask: ".js-text-mask",
        };

        this.wrapper = document.querySelectorAll(this.DOM.wrapper);
        this.init();
    }

    init() {
        if (this.wrapper.length < 1) {
            return;
        }

        this.wrapper.forEach((wrapper) => {
            this.textController(wrapper);
        });
    }

    textController(wrapper) {
        const texts = wrapper.querySelectorAll(this.DOM.text);
        const masks = wrapper.querySelectorAll(this.DOM.mask);

        gsap.set(texts, {
            autoAlpha: 0,
        });

        texts.forEach(text => {
            gsap.to(text, {
                autoAlpha: 1,
                scrollTrigger: {
                    trigger: text,
                    start: "bottom 95%",
                }
            })
        })

        masks.forEach(mask => {
            gsap.to(mask, {
                x: "120%",
                scrollTrigger: {
                    trigger: mask,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: true
                }
            })
        })
    }
}

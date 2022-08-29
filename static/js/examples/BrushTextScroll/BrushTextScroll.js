import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default class BrushTextScroll {
    constructor() {
        this.DOM = {
            wrapper: ".js-brush-text-scroll",
            text: ".js-text-line",
            textClone: ".js-text-line-clone",
        };

        this.wrapper = document.querySelectorAll(this.DOM.wrapper);
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
        const texts = wrapper.querySelector(this.DOM.text);
        const textClone = wrapper.querySelector(this.DOM.textClone);

        const mainLineParent = new SplitText(texts, {
            type: "lines",
            linesClass: "lineParent",
        });

        const mainLineChild = new SplitText(mainLineParent.lines, {
            type: "lines",
            linesClass: "lineChild",
        });

        const lineParent = new SplitText(textClone, {
            type: "lines",
            linesClass: "lineParent",
        });

        const lineChild = new SplitText(lineParent.lines, {
            type: "lines",
            linesClass: "lineChild",
        });

        gsap.set(lineChild.lines, {
            x: "100%",
        });

        gsap.set(lineParent.lines, {
            x: "-100%",
        });

        lineChild.lines.forEach((line) => {
            gsap.to(line, {
                x: "0%",
                scrollTrigger: {
                    scrub: 0.8,
                    trigger: line,
                    start: "bottom 70%",
                    end: `bottom ${window.innerHeight * 0.7 - line.offsetHeight}`,
                    toggleActions: "play play play play",
                },
            });
        });

        lineParent.lines.forEach((line) => {
            gsap.to(line, {
                x: "0%",
                scrollTrigger: {
                    scrub: 0.8,
                    trigger: line,
                    start: "bottom 70%",
                    end: `bottom ${window.innerHeight * 0.7 - line.offsetHeight}`,
                    toggleActions: "play play play play",
                },
            });
        });
    }
}

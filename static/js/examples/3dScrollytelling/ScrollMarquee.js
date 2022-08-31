import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class ScrollMarquee {
    constructor() {
        this.DOM = {
            mainWrapper: ".js-scroll-marquee",
            topLine: ".js-scroll-marquee-top",
            bottomLine: ".js-scroll-marquee-bottom",
        };

        this.mainWrappers = document.querySelectorAll(this.DOM.mainWrapper);
    }

    init() {
        if (this.mainWrappers.length < 1) {
            return;
        }

        this.mainWrappers.forEach((wrapper) => {
            this.singleLine(wrapper);
        });
    }

    singleLine(wrapper) {
        const topLine = wrapper.querySelector(this.DOM.topLine);
        const bottomLine = wrapper.querySelector(this.DOM.bottomLine);

        if (topLine != null) {
            this.animateLine(topLine, 1, wrapper);
        }

        if (bottomLine != null) {
            this.animateLine(bottomLine, -1, wrapper);
        }

        ScrollTrigger.create({
            trigger: wrapper,
            pin: true,
            start: "top top",
            end: "150%",
            onEnter: () => {
                console.log("enter");
            },
        });
    }

    animateLine(line, direction, wrapper) {
        let start = -(line.offsetWidth - window.innerWidth);
        let end = 0;

        if (direction === -1) {
            start = 0;
            end = -(line.offsetWidth - window.innerWidth);
        }

        gsap.fromTo(
            line,
            {
                x: start,
            },
            {
                x: end,
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top bottom",
                    end: `bottom+=${wrapper.offsetHeight * 1} top`,
                    scrub: 1,
                },
                ease: "none",
            },
        );
    }
}

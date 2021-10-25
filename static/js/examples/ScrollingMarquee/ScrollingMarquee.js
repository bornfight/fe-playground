import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class ScrollingMarquee {
    constructor() {
        this.dividers = document.querySelectorAll(".js-scrolling-marquee-divider");
        this.lines = document.querySelectorAll(".js-scrolling-marquee-line");

        if (this.dividers.length < 1 || this.lines.length < 1) {
            return;
        }

        this.topAnimOffset = this.lines[0].offsetHeight;
        this.winWidth = window.innerWidth;
        this.randomDividerPosition();
        this.linesTrigger();
    }

    randomDividerPosition() {
        this.dividers.forEach((divider, index) => {
            let random = Math.random();

            if (random > 0.8) {
                random = 0.7;
            } else if (random < 0.1) {
                random = 0.3;
            }

            divider.style.left = `${this.winWidth * random}px`;
            this.dividerController(divider, index);
        });
    }

    linesTrigger() {
        this.lines.forEach((line) => {
            this.lineController(line);
        });
    }

    lineController(line) {
        gsap.to(line, {
            scrollTrigger: {
                trigger: line,
                start: "top bottom",
                end: `bottom+=${this.topAnimOffset * 2} top`,
                scrub: true
            },
            x: "-100%",
            ease: "power3.inOut"
        });
    }

    dividerController(divider, index) {
        const random = Math.random();
        let offset = random * 200;
        if (index % 2 === 0) {
            offset = -offset;
        }

        gsap.to(divider, {
            scrollTrigger: {
                trigger: divider,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            x: `${offset}%`,
            scaleX: 1 + random
        });
    }
}

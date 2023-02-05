import { gsap } from "gsap/dist/gsap";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(SplitText);

export default class PanningGallery {
    constructor() {
        this.DOM = {
            panningContainer: ".js-panning-container",
            panningElement: ".js-panning-element",
            panningItem: ".js-panning-item",

            //
            titleNumberCurrent: ".js-title-number-current",

            //
            titleCurrent: ".js-title-current",
        };

        //
        this.zeroPad = (num, places) => String(num).padStart(places, "0");

        this.panningContainer = document.querySelector(this.DOM.panningContainer);
        this.panningElement = document.querySelector(this.DOM.panningElement);

        //
        this.panningItem = document.querySelectorAll(this.DOM.panningItem);

        //
        this.titleNumberCurrent = document.querySelector(this.DOM.titleNumberCurrent);

        //
        this.title = document.querySelector(this.DOM.title);
        this.titleCurrent = document.querySelector(this.DOM.titleCurrent);
    }

    init() {
        if (this.panningElement == null) {
            return;
        }

        console.log("PanningGallery init()");

        let panElementW = this.panningElement.clientWidth;
        let panElementH = this.panningElement.clientHeight;

        gsap.set(this.panningElement, {
            x: -(panElementW - window.innerWidth) * 0.5,
            y: -(panElementH - window.innerHeight) * 0.5,
        });

        this.initMousemove();
        this.initMouseEnter();
    }

    initMousemove() {
        window.addEventListener("mousemove", (ev) => {
            this.onMouseMove(ev);
        });
    }

    initMouseEnter() {
        for (let i = 0, l = this.panningItem.length; i < l; i++) {
            this.panningItem[i].addEventListener("mouseenter", (ev) => {
                ev.preventDefault();

                this.changeTitleNumber(i + 1);
                this.changeTitle(ev.currentTarget);
            });
        }
    }

    initMouseLeave() {}

    onMouseMove(ev) {
        let mouseX = ev.clientX;
        let mouseY = ev.clientY;

        let panElementW = this.panningElement.clientWidth;
        let panElementH = this.panningElement.clientHeight;

        let offsetX = window.innerWidth - panElementW;
        let offsetY = window.innerHeight - panElementH;

        gsap.to(this.panningElement, {
            duration: 1,
            x: (mouseX / window.innerWidth) * offsetX,
            y: (mouseY / window.innerHeight) * offsetY,
            ease: "power3.out",
        });
    }

    changeTitleNumber(index) {
        this.titleNumberCurrent.textContent = this.zeroPad(index, 3);
    }

    changeTitle(item) {
        this.titleCurrent.textContent = item.getAttribute("data-title");

        let titleSplit = new SplitText(this.titleCurrent);
        let titleSplitTimeline = gsap.timeline();

        titleSplitTimeline.clear().time(0);
        titleSplit.revert();

        titleSplit.split({ type: "chars" });
        titleSplitTimeline.from(titleSplit.chars, {
            duration: 1,
            scale: 1.15,
            autoAlpha: 0,
            ease: "power3.out",
            stagger: {
                grid: [1, 15],
                from: "random",
                amount: 0.35,
            },
        });
    }
}

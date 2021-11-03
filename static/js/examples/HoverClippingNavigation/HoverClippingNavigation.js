import gsap from "gsap";

export default class HoverClippingNavigation {
    constructor() {
        this.DOM = {
            wrapper: ".js-list-wrapper",
            clipList: ".js-clip-list",
            clipListWrapper: ".js-clip-list-wrapper",
        };
    }

    /**
     * Init
     */
    init() {
        let wrapper = document.querySelector(this.DOM.wrapper);

        if (wrapper == null) {
            return;
        }


        let clipList = document.querySelector(this.DOM.clipList);
        let clipListWrapper = document.querySelector(this.DOM.clipListWrapper);
        let centerHeight = clipListWrapper.offsetHeight / 2;

        gsap.set(clipListWrapper, {
            y: 0
        });

        gsap.set(clipList, {
            y: 0
        });

        wrapper.addEventListener("mousemove", ev => {
            const posY = ev.pageY - wrapper.offsetTop;
            const offsetWrapper = posY - centerHeight;
            const offsetList = -posY + centerHeight;

            gsap.to(clipListWrapper, {
                duration: 0.5,
                delay: 0.1,
                ease: "power4.out",
                y: offsetWrapper
            });

            gsap.to(clipList, {
                duration: 0.5,
                delay: 0.1,
                ease: "power4.out",
                y: offsetList
            });
        });
    }
}

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class RotationalScroll {
    constructor() {
        this.DOM = {
            rotational: ".js-rotational",
            rotationalWrap: ".js-rotational-wrap",
            rotationalItem: ".js-item",
            rotationalSpacer: ".js-rotational-spacer",
        };

        this.rotationalWrap = document.querySelectorAll(this.DOM.rotationalWrap);
        this.rotational = document.querySelector(this.DOM.rotational);
        this.rotationItem = document.querySelectorAll(this.DOM.rotationalItem);
        this.animatedContent = document.querySelectorAll(this.DOM.animatedContent);
        this.rotationalSpacers = document.querySelectorAll(this.DOM.rotationalSpacer);
        this.currentSlide = -1;
    }

    /**
     * Init
     */
    init() {
        //return if there is no wrapper
        if (!this.rotationalWrap) {
            return;
        }
        this.rotationalSpacers.forEach((item, index) => {
            this.rotationalController(item, index);
        });
    }

    /**
     *
     * @param item
     * @param index
     * Method for rotation witch calls for animation Method once is finished
     */
    rotationalController(item, index) {
        gsap.fromTo(
            //rotate by number of items
            this.rotational,
            {
                rotate: 90 * (index - 1),
            },
            {
                rotate: 90 * index,
                ease: "none",
                scrollTrigger: {
                    trigger: item,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: true,
                    snap: 1,
                },
                //animation on enter
                onComplete: () => {
                    this.animateItem(index);
                },
                onReverseComplete: () => {
                    this.animateItem(index - 1);
                },
            },
        );
    }

    /**
     *
     * @param index
     * gives current item active class and deals with animation
     */
    animateItem(index) {
        if (this.currentSlide !== index) {
            if (this.rotationItem[this.currentSlide] !== null && this.rotationItem[this.currentSlide] !== undefined) {
                this.onLeaveAnim(this.rotationItem[this.currentSlide]);
            }
            this.currentSlide = index;
            this.rotationItem.forEach((item) => {
                item.classList.remove("active");
            });
            if (this.rotationItem[this.currentSlide] !== null && this.rotationItem[this.currentSlide] !== undefined) {
                this.rotationItem[this.currentSlide].classList.add("active");
                this.onEnterAnim(this.rotationItem[this.currentSlide]);
            }
        }
    }

    /**
     *
     * @param currentSlide
     * Animations when curren item is visible
     */

    onEnterAnim(currentSlide) {
        this.animatedItems = currentSlide.querySelectorAll(".js-content-animated");
        this.animatedItemsLeft = currentSlide.querySelectorAll(".js-content-animated-left");
        this.animatedItemsRight = currentSlide.querySelectorAll(".js-content-animated-right");
        this.animatedItemsFloat = currentSlide.querySelectorAll(".js-content-animated-float");

        gsap.fromTo(
            this.animatedItems,
            {
                opacity: 0,
                y: "50%",
                duration: 1,
                delay: 0.7,
            },
            {
                opacity: 1,
                y: "0%",
                stagger: 0.5,
            },
        );

        gsap.fromTo(
            this.animatedItemsLeft,
            {
                x: "0%",
            },
            {
                x: "-80%",
                duration: 15,
                repeat: -1,
                yoyo: true,
            },
        );

        gsap.fromTo(
            this.animatedItemsRight,
            {
                x: "0%",
            },
            {
                x: "80%",
                duration: 15,
                repeat: -1,
                yoyo: true,
            },
        );

        gsap.fromTo(
            this.animatedItemsFloat,
            {
                x: "200%",
            },
            {
                x: "-700%",
                duration: 15,
                repeat: -1,
                stagger: 2,
            },
        );
    }

    /**
     *
     * @param currentSlide
     * Animation when current item leaves the screen
     */

    onLeaveAnim(currentSlide) {
        this.animatedItems = currentSlide.querySelectorAll(".js-content-animated");
        this.animatedItemsLeft = currentSlide.querySelectorAll(".js-content-animated-left");
        this.animatedItemsRight = currentSlide.querySelectorAll(".js-content-animated-right");
        this.animatedItemsFloat = currentSlide.querySelectorAll(".js-content-animated-float");

        gsap.to(this.animatedItems, {
            opacity: 0,
            delay: 0.7,
        });

        gsap.to(this.animatedItemsLeft, {
            overwrite: true,
            x: "0%",
            delay: 0.3,
        });

        gsap.to(this.animatedItemsRight, {
            overwrite: true,
            x: "0%",
            delay: 0.3,
        });

        gsap.to(this.animatedItemsFloat, {
            overwrite: true,
            x: "200%",
            delay: 0.3,
        });
    }
}

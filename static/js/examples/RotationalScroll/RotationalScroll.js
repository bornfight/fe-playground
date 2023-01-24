import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class RotationalScroll {
    constructor() {
        this.DOM = {
            rotational: ".js-rotational",
            rotationalWrap: ".js-rotational-wrap",
            rotationalItem: ".js-item",
            animatedContent: ".js-animated-content",
            rotationalSpacer: ".js-rotational-spacer",
        };

        this.rotationalWrap = document.querySelector(this.DOM.rotationalWrap);
        this.rotational = document.querySelector(this.DOM.rotational);
        this.rotationItem = document.querySelectorAll(this.DOM.rotationalItem);
        this.animatedContent = document.querySelectorAll(this.DOM.animatedContent);
        this.rotationalSpacers = document.querySelectorAll(this.DOM.rotationalSpacer);
        this.currentSlide = -1;
    }

    init() {
        // this.rotationalController();
        // this.zoomItem(0);
        this.rotationalSpacers.forEach((item, index) => {
            this.rotationalController2(item, index);
        });
    }

    rotationalController2(item, index) {
        gsap.fromTo(
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
                onComplete: () => {
                    this.zoomItem(index);
                },
                onReverseComplete: () => {
                    this.zoomItem(index - 1);
                },
            },
        );
    }

    // rotationalController() {
    //     const timeline = gsap.timeline({
    //         scrollTrigger: {
    //             trigger: this.rotationalWrap,
    //             star: "top top",
    //             end: "bottom bottom",
    //             scrub: 0.8,
    //             // normalizeScroll: true,
    //             snap: {
    //                 snapTo: "labels",
    //                 duration: { min: 0.2, max: 0.5 },
    //                 delay: 0,
    //                 ease: "power1.inOut",
    //             },
    //         },
    //     });
    //
    //     timeline
    //         .addLabel("zero")
    //         .to(this.rotational, {
    //             rotate: 0,
    //             ease: "none",
    //             onUpdate: () => {
    //                 this.zoomItem(0);
    //             },
    //         })
    //         .addLabel("first")
    //         .to(this.rotational, {
    //             rotate: 90,
    //             ease: "none",
    //             onUpdate: () => {
    //                 this.zoomItem(1);
    //             },
    //         })
    //         .addLabel("second")
    //         .to(this.rotational, {
    //             rotate: 180,
    //             ease: "none",
    //             onUpdate: () => {
    //                 this.zoomItem(2);
    //             },
    //         })
    //         .addLabel("third")
    //         .to(this.rotational, {
    //             rotate: 270,
    //             ease: "none",
    //             onUpdate: () => {
    //                 this.zoomItem(3);
    //             },
    //         })
    //         .addLabel("fourth");
    //     // .to(this.rotational, {
    //     //     rotate: 270,
    //     //     ease: "none",
    //     //     onUpdate: () => {
    //     //         this.zoomItem(3);
    //     //     },
    //     // });
    // }

    zoomItem(index) {
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

    onLeaveAnim(currentSlide) {
        this.animatedItems = currentSlide.querySelectorAll(".js-content-animated");
        gsap.to(this.animatedItems, {
            opacity: 0,
            delay: 0.7,
        });

        gsap.to(this.animatedItemsLeft, {
            x: "0%",
            delay: 0.3,
        });

        gsap.to(this.animatedItemsRight, {
            x: "0%",
            delay: 0.3,
        });

        gsap.to(this.animatedItemsFloat, {
            x: "200%",
        });
    }
}

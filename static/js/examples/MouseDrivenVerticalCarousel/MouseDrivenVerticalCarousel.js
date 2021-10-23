import gsap from "gsap";

export default class VerticalMouseDrivenCarousel {
    constructor() {
        this.defaults = {
            carousel: ".js-mouse-driven-vertical-carousel",
            bgImg: ".js-mouse-driven-vertical-carousel-bg-img",
            list: ".js-mouse-driven-vertical-carousel-list",
            listItem: ".js-mouse-driven-vertical-carousel-list-item"
        };

        this.posY = 0;

        this.initCursor();
        this.init();
        this.bgImgController();
    }

    //region getters
    getBgImgs() {
        return document.querySelectorAll(this.defaults.bgImg);
    }

    getListItems() {
        return document.querySelectorAll(this.defaults.listItem);
    }

    getList() {
        return document.querySelector(this.defaults.list);
    }

    getCarousel() {
        return document.querySelector(this.defaults.carousel);
    }

    init() {
        gsap.set(this.getBgImgs(), {
            autoAlpha: 0,
            scale: 1.05
        });

        gsap.set(this.getBgImgs()[0], {
            autoAlpha: 1,
            scale: 1
        });

        this.listItems = this.getListItems().length - 1;

        this.listOpacityController(0);
    }

    initCursor() {
        const listHeight = this.getList().clientHeight;
        const carouselHeight = this.getCarousel().clientHeight;

        this.getCarousel().addEventListener(
            "mousemove",
            event => {
                this.posY = event.pageY - this.getCarousel().offsetTop;
                let offset = -this.posY / carouselHeight * listHeight;

                gsap.to(this.getList(), {
                    duration: 0.3,
                    y: offset,
                    ease: "power4.out"
                });
            },
            false
        );
    }

    bgImgController() {
        for (const link of this.getListItems()) {
            link.addEventListener("mouseenter", ev => {
                let currentId = ev.currentTarget.dataset.itemId;

                this.listOpacityController(currentId);

                gsap.to(ev.currentTarget, {
                    duration: 0.3,
                    autoAlpha: 1
                });

                gsap.to(".is-visible", {
                    duration: 0.2,
                    autoAlpha: 0,
                    scale: 1.05
                });

                if (!this.getBgImgs()[currentId].classList.contains("is-visible")) {
                    this.getBgImgs()[currentId].classList.add("is-visible");
                }

                gsap.to(this.getBgImgs()[currentId], {
                    duration: 0.6,
                    autoAlpha: 1,
                    scale: 1
                });
            });
        }
    }

    listOpacityController(id) {
        id = parseInt(id);
        let aboveCurrent = this.listItems - id;
        let belowCurrent = parseInt(id);

        if (aboveCurrent > 0) {
            for (let i = 1; i <= aboveCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 5 * i;
                gsap.to(this.getListItems()[id + i], {
                    duration: 0.5,
                    autoAlpha: opacity,
                    x: offset,
                    ease: "power3.out"
                });
            }
        }

        if (belowCurrent > 0) {
            for (let i = 0; i <= belowCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 5 * i;
                gsap.to(this.getListItems()[id - i], {
                    duration: 0.5,
                    autoAlpha: opacity,
                    x: offset,
                    ease: "power3.out"
                });
            }
        }
    }
}
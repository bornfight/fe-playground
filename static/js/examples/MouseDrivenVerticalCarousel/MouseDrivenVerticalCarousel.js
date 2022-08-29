import gsap from "gsap";

export default class VerticalMouseDrivenCarousel {
    constructor() {
        this.defaults = {
            carousel: ".js-mouse-driven-vertical-carousel",
            bgImg: ".js-mouse-driven-vertical-carousel-bg-img",
            list: ".js-mouse-driven-vertical-carousel-list",
            listItem: ".js-mouse-driven-vertical-carousel-list-item",
        };

        this.posY = 0;

        if (this.getCarousel() == null) {
            return;
        }

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
            scale: 1.05,
            overwrite: true,
        });

        gsap.set(this.getBgImgs()[0], {
            autoAlpha: 1,
            scale: 1,
            overwrite: true,
        });

        this.listItems = this.getListItems().length - 1;

        gsap.to("body", {
            backgroundColor: this.getListItems()[0].dataset.color,
        });

        this.listOpacityController(0);
    }

    initCursor() {
        const listHeight = this.getList().clientHeight;
        const carouselHeight = this.getCarousel().clientHeight;

        this.getCarousel().addEventListener(
            "mousemove",
            (event) => {
                this.posY = event.pageY - this.getCarousel().offsetTop;
                let offset = (-this.posY / carouselHeight) * listHeight;

                gsap.to(this.getList(), {
                    duration: 0.3,
                    y: offset,
                    ease: "power4.out",
                    overwrite: true,
                });
            },
            false,
        );
    }

    bgImgController() {
        for (const link of this.getListItems()) {
            link.addEventListener("mouseenter", (ev) => {
                let currentId = ev.currentTarget.dataset.itemId;
                let currentColor = ev.currentTarget.dataset.color;

                this.listOpacityController(currentId);

                gsap.to("body", {
                    backgroundColor: currentColor,
                });

                gsap.to(ev.currentTarget, {
                    duration: 0.3,
                    autoAlpha: 1,
                    overwrite: true,
                });

                gsap.to(".is-visible", {
                    duration: 0.2,
                    autoAlpha: 0,
                    scale: 1.05,
                    overwrite: true,
                });

                if (!this.getBgImgs()[currentId].classList.contains("is-visible")) {
                    this.getBgImgs()[currentId].classList.add("is-visible");
                }

                gsap.to(this.getBgImgs()[currentId], {
                    duration: 0.6,
                    autoAlpha: 1,
                    scale: 1,
                    overwrite: true,
                });

                gsap.to(this.getListItems()[currentId], {
                    duration: 0.5,
                    autoAlpha: 1,
                    x: "0vw",
                    ease: "power3.out",
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
                let offset = 2 * i;
                gsap.to(this.getListItems()[id + i], {
                    duration: 0.5,
                    autoAlpha: opacity,
                    x: `${offset}vw`,
                    ease: "power3.out",
                });
            }
        }

        if (belowCurrent > 0) {
            for (let i = 0; i <= belowCurrent; i++) {
                let opacity = 0.5 / i;
                let offset = 2 * i;
                gsap.to(this.getListItems()[id - i], {
                    duration: 0.5,
                    autoAlpha: opacity,
                    x: `${offset}vw`,
                    ease: "power3.out",
                });
            }
        }
    }
}

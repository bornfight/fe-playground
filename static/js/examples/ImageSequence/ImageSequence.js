import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import is from "is_js";

gsap.registerPlugin(ScrollTrigger);

export default class ImageSequence {
    constructor() {
        this.DOM = {
            sequence: ".js-image-sequence",
            step: ".js-sequence-step",
        };
    }

    init() {
        this.sequence = document.querySelector(this.DOM.sequence);

        if (!this.sequence) {
            return;
        }

        this.frameIndex = 0;
        this.sequenceVisible = true;

        this.win = {
            w: window.innerWidth,
            h: window.innerHeight,
        };

        this.imagesArray = [];

        this.imagesArray = window.imgArray;

        // is its string
        // this.imagesArray = JSON.parse(window.imgArray);

        if (is.mobile()) {
            this.imagesArray = window.imgArray;
            // this.imagesArray = JSON.parse(window.imgArray);
        }

        if (this.imagesArray && this.imagesArray.length > 0) {
            this.sections = gsap.utils.toArray(this.DOM.step);

            this.bgVideoSegments = [0];

            this.sections.forEach((section) => {
                this.bgVideoSegments.push(section.dataset.frameSecond);
            });

            this.loaded = 0;

            // don't squish img when resized
            window.addEventListener("resize", () => {
                this.win = {
                    w: window.innerWidth,
                    h: window.innerHeight,
                };

                this.sequence.width = this.win.w;
                this.sequence.height = this.win.h;

                this.updateImage(this.frameIndex);
            });

            this.canvasLoad();
            this.sequenceController();
        }
    }

    canvasLoad() {
        this.context = this.sequence.getContext("2d");
        this.imageUrl = this.sequence.dataset.desktopUrl;

        // this.imageUrls = window.designContentImages;
        this.context.imageSmoothingEnabled = true;

        // num of images
        this.frameCount = this.imagesArray.length;
        this.framesLoaded = 0;

        // initial image load
        this.img = new Image();
        this.img.src = this.currentFrame(1);
        this.sequence.width = this.sequence.offsetWidth;
        this.sequence.height = this.sequence.offsetHeight;

        this.img.onload = () => {
            this.imageStretch(this.img);
        };

        this.singleChunk = Math.floor(
            this.frameCount / this.bgVideoSegments.length,
        );

        this.images = [];

        this.preloadImages();
    }

    preloadImages() {
        if (this.loaded < this.bgVideoSegments.length) {
            for (
                let i = this.singleChunk * this.loaded;
                i < this.singleChunk * (this.loaded + 1);
                i++
            ) {
                const img = new Image();
                img.src = this.currentFrame(i);
                const imageProps = [img, i];
                this.images.push(imageProps);
                img.onload = () => {
                    this.framesLoaded += 1;

                    // this.frameCount / 2 - load half of frames and than hide the loader
                    const progress =
                        (100 / (this.frameCount / 2)) * this.framesLoaded;
                    console.log((100 / this.frameCount) * this.framesLoaded);
                    if (progress) {
                        this.progressController(Math.floor(progress));
                    }
                };
            }

            this.loaded++;
            setTimeout(() => {
                this.preloadImages();
            }, 1000);
        }
    }

    currentFrame(index) {
        return `${this.imagesArray[index].url}`;
    }

    imageStretch(img) {
        if (img == null) {
            return;
        }

        const imgRatio = img.height / img.width;
        const winRatio = window.innerHeight / window.innerWidth;
        if (imgRatio > winRatio) {
            const h = window.innerWidth * imgRatio;
            this.context.drawImage(
                img,
                0,
                (window.innerHeight - h) / 2,
                window.innerWidth,
                h,
            );
        }
        if (imgRatio < winRatio) {
            const w = (window.innerWidth * winRatio) / imgRatio;
            this.context.drawImage(
                img,
                (this.win.w - w) / 2,
                0,
                w,
                window.innerHeight,
            );
        }
    }

    updateImage(index) {
        if (this.images[index] != null) {
            this.imageStretch(this.images[index][0]);
        }
    }

    sequenceController() {
        let scrollDirection = 1;

        this.sections.forEach((step, i) => {
            const segmentLength =
                this.bgVideoSegments[i + 1] - this.bgVideoSegments[i];
            const inc =
                segmentLength / this.bgVideoSegments[this.sections.length];

            // step.style.height = segmentLength * 100 + "vh";

            this.scrollInteractions(inc, scrollDirection, i, step);
        });
    }

    scrollInteractions(inc, scrollDirection, i, step) {
        let starting;

        if (i === 0) {
            starting = "top top";
        } else {
            starting = "top bottom";
        }

        ScrollTrigger.create({
            trigger: step,
            start: starting,
            end: "bottom bottom",
            onUpdate: (self) => {
                let progress = 0;
                if (this.bgVideoSegments[this.sections.length] != null) {
                    progress =
                        this.bgVideoSegments[i] /
                        this.bgVideoSegments[this.sections.length] +
                        self.progress * inc;
                }

                this.frameIndex = Math.floor(progress * this.frameCount);

                this.updateImage(this.frameIndex);
            },
        });
    }

    fadeVideo() {
        if (this.sequenceVisible === true) {
            this.sequenceVisible = false;
            gsap.to(this.sequence, {
                autoAlpha: 0,
            });
        } else if (this.sequenceVisible === false) {
            this.sequenceVisible = true;
            gsap.to(this.sequence, {
                autoAlpha: 1,
            });
        }
    }

    progressController(progress) {
        if (progress > 90) {
            // ScrollTrigger.refresh();
        }
    }
}

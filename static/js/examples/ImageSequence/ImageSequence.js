import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import is from "is_js";

gsap.registerPlugin(ScrollTrigger);

export default class ImageSequence {
    constructor() {
        this.DOM = {
            sequence: ".js-image-sequence",
            sequenceWrapper: ".js-image-sequence-wrapper",
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
            this.steps = gsap.utils.toArray(this.DOM.step);

            this.timeSequenceSegments = [0];

            this.steps.forEach((step) => {
                this.timeSequenceSegments.push(parseFloat(step.dataset.frameSecond));
            });

            this.loaded = 0;

            // don't squish img when resized
            window.addEventListener("resize", () => this.resize());

            this.canvasLoad();
            this.sequenceController();
        }
    }

    canvasLoad() {
        this.context = this.sequence.getContext("2d");
        this.context.imageSmoothingEnabled = true;
        this.imageUrl = this.sequence.dataset.desktopUrl;

        // for retina screens
        this.retinaScale();

        // num of images
        this.frameCount = this.imagesArray.length;
        this.framesLoaded = 0;

        // initial image load
        this.img = new Image();
        this.img.src = this.currentFrame(1);
        this.sequence.width = this.sequence.offsetWidth;
        this.sequence.height = this.sequence.offsetHeight;

        this.img.onload = () => {
            this.drawImage(this.img);
        };

        this.singleChunk = Math.floor(
            this.frameCount / this.timeSequenceSegments.length,
        );

        this.images = [];

        this.preloadImages();
    }

    preloadImages() {
        if (this.loaded < this.timeSequenceSegments.length) {
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

                    if (this.framesLoaded > 0) {
                        this.progressController();
                    }
                };
            }

            this.loaded++;
            setTimeout(() => {
                this.preloadImages();
            }, 500);
        }
    }

    currentFrame(index) {
        return `${this.imagesArray[index].url}`;
    }

    drawImage(img) {
        if (img != null) {
            this.context.drawImage(img, 0, 0, this.sequence.width, this.sequence.height);
        }
    }

    updateImage(index) {
        if (this.images[index] != null) {
            this.drawImage(this.images[index][0]);
        }
    }

    sequenceController() {
        let scrollDirection = 1;

        this.steps.forEach((step, i) => {
            const segmentLength =
                this.timeSequenceSegments[i + 1] - this.timeSequenceSegments[i];
            const inc =
                segmentLength / this.timeSequenceSegments[this.steps.length];

            this.scrollInteractions(inc, scrollDirection, i, step);
        });
    }

    scrollInteractions(inc, scrollDirection, i, step) {
        let starting;
        let ending = "bottom bottom";

        if (i === 0) {
            starting = "top top";
        } else {
            starting = "top bottom";
        }

        ScrollTrigger.create({
            trigger: step,
            start: starting,
            end: ending,
            onUpdate: (self) => {
                let progress = 0;
                if (this.timeSequenceSegments[this.steps.length] != null) {
                    progress =
                        this.timeSequenceSegments[i] /
                        this.timeSequenceSegments[this.steps.length] +
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

    progressController() {
        const frameCount = parseFloat(this.steps[1].dataset.frameSecond) / parseFloat(this.steps[this.steps.length - 1].dataset.frameSecond) * this.frameCount;
        const progress = Math.floor((100 / (frameCount)) * this.framesLoaded);


        if (progress < 100) {
            // console.log(progress);
        } else if (progress === 100) {
            console.log("Images for first section loaded!");
            gsap.to(this.DOM.sequenceWrapper, {
                autoAlpha: 1,
            });
        }
    }

    resize() {
        this.win = {
            w: window.innerWidth,
            h: window.innerHeight,
        };

        this.sequence.width = this.win.w;
        this.sequence.height = this.win.h;

        // this.sequence.width = this.sequence.offsetWidth;
        // this.sequence.height = this.sequence.offsetHeight;

        this.retinaScale();
        this.updateImage(this.frameIndex);
    }

    retinaScale() {
        // for retina screens
        if (window.devicePixelRatio !== 1) {
            const width = c.width;
            const height = c.height;

            // scale the canvas by window.devicePixelRatio
            this.context.setAttribute('width', width * window.devicePixelRatio);
            this.context.setAttribute('height', height * window.devicePixelRatio);

            // use css to bring it back to regular size
            this.context.setAttribute('style', 'width="' + width + '"; height="' + height + '";')

            // set the scale of the context
            this.context.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }
}

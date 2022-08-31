import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/dist/ScrollTrigger";
import is from "is_js";

gsap.registerPlugin(ScrollTrigger);

export default class ImageSequence {
    constructor() {
        this.DOM = {
            sequence: ".js-image-sequence",
            sequenceWrapper: ".js-image-sequence-wrapper",
            canvasWrapper: ".js-image-sequence-canvas-wrapper",
            step: ".js-sequence-step",
        };
    }

    init() {
        this.sequenceWrapper = document.querySelector(this.DOM.sequenceWrapper);

        if (!this.sequenceWrapper) {
            return;
        }
        this.sequence = document.querySelector(this.DOM.sequence);
        this.canvasWrapper = document.querySelector(this.DOM.canvasWrapper);

        // set scroll position to top of the document
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        this.loaded = false;

        this.frameIndex = 0;
        this.sequenceVisible = true;

        this.imagesArray = [];

        this.imagesArray = window.imgArray;

        // if its string
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

            this.segmentsLoaded = 0;

            // don't squish img when resized
            window.addEventListener("resize", () => this.resize());

            this.canvasLoad();
            this.sequenceController();
        }
    }

    canvasLoad() {
        this.context = this.sequence.getContext("2d");
        this.context.imageSmoothingEnabled = true;
        this.imageUrl = "";

        // for retina screens
        this.retinaScale();

        // num of images
        this.frameCount = this.imagesArray.length;
        this.framesLoaded = 0;

        // initial image load
        this.img = new Image();
        this.img.src = this.currentFrame(0);

        this.sequence.width = this.canvasWrapper.offsetWidth;
        this.sequence.height = this.canvasWrapper.offsetHeight;

        this.img.onload = () => {
            this.drawImage(this.img);
        };

        // num of images in single chunk - for preload sequence
        this.singleChunk = Math.floor(
            this.frameCount / this.timeSequenceSegments.length,
        );

        this.images = [];

        this.preloadImages();
    }

    preloadImages() {
        if (this.segmentsLoaded < this.timeSequenceSegments.length) {
            for (
                let i = this.singleChunk * this.segmentsLoaded;
                i < this.singleChunk * (this.segmentsLoaded + 1);
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

            this.segmentsLoaded++;
            setTimeout(() => {
                this.preloadImages();
            }, 500);
        }
    }

    /**
     *
     * @param {number} index
     * @returns {string}
     */
    currentFrame(index) {
        return `${this.imagesArray[index].url}`;
    }

    /**
     *
     * @param {HTMLImageElement} img
     */
    drawImage(img) {
        if (img != null) {
            this.context.drawImage(img, 0, 0, this.sequence.width, this.sequence.height);
        }
    }

    /**
     *
     * @param {number} index
     */
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

    /**
     *
     * @param {number} inc
     * @param {number} scrollDirection
     * @param {number} i
     * @param {HTMLElement} step
     */
    scrollInteractions(inc, scrollDirection, i, step) {
        let trigger = step;

        // if the step is pinned inside ScrollTrigger
        if (step.parentNode.classList.contains("pin-spacer")) {
            trigger = step.parentNode;
        }

        let starting;
        let ending = "bottom bottom";

        if (i === 0) {
            starting = "top top";
        } else {
            starting = "top bottom";
        }

        ScrollTrigger.create({
            trigger: trigger,
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

    progressController() {
        const frameCount = parseFloat(this.steps[1].dataset.frameSecond) / parseFloat(this.steps[this.steps.length - 1].dataset.frameSecond) * this.frameCount;
        const progress = Math.floor((100 / (frameCount)) * this.framesLoaded);

        if (progress < 100) {
            // console.log(progress);
        } else if (progress >= 100 && !this.loaded) {
            console.log("Images for first section are loaded!");
            this.loaded = true;

            gsap.to(this.sequenceWrapper, {
                autoAlpha: 1,
            });
        }
    }

    resize() {
        this.sequence.width = this.canvasWrapper.clientWidth;
        this.sequence.height = this.canvasWrapper.clientHeight;

        this.retinaScale();
        this.updateImage(this.frameIndex);
    }

    retinaScale() {
        // for retina screens
        if (window.devicePixelRatio !== 1) {
            const width = this.canvasWrapper.clientWidth;
            const height = this.canvasWrapper.clientHeight;

            // scale the canvas by window.devicePixelRatio
            this.sequence.setAttribute('width', `${width * window.devicePixelRatio}`);
            this.sequence.setAttribute('height', `${height * window.devicePixelRatio}`);

            // use css to bring it back to regular size
            this.sequence.setAttribute('style', 'width="' + width + '"; height="' + height + '";')

            // set the scale of the context
            this.sequence.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }
}

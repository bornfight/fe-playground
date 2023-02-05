require("../../vendor/three");
import { EffectComposer } from "../../vendor/three/jsm/postprocessing/EffectComposer";
import { RenderPass } from "../../vendor/three/jsm/postprocessing/RenderPass";
import { ShaderPass } from "../../vendor/three/jsm/postprocessing/ShaderPass";
import { CopyShader } from "../../vendor/three/jsm/shaders/CopyShader";
import { SavePass } from "../../vendor/three/jsm/postprocessing/SavePass";
import { BlendShader } from "../../vendor/three/jsm/shaders/BlendShader";
import { gsap } from "gsap";
import Swiper from "swiper";
import is from "is_js";
import data from "./data.json";

export default class ThreeSpiralGallery {
    constructor() {
        if (document.querySelector("#gallery-slider") == null) {
            return;
        }

        THREE.Cache.enabled = true;

        this.DOM = {
            gallery: ".js-3d-spiral-gallery",
            gradient: ".js-3d-spiral-gallery-gradient",
            slider: ".js-3d-spiral-gallery-slider",
            sliderWrapper: ".js-3d-spiral-gallery-slider-wrapper",
            progressLine: ".js-3d-spiral-gallery-pagination-progress-line",
            sliderPaginationBullet: ".swiper-pagination-bullet",
        };

        this.gallery = document.querySelector(this.DOM.gallery);
        this.gradient = document.querySelector(this.DOM.gradient);

        this.winWidth = this.gallery.offsetWidth;
        this.winHeight = this.gallery.offsetHeight;

        this.slider = document.querySelector(this.DOM.slider);

        this.progressLine = document.querySelector(this.DOM.progressLine);
        this.sliderWrapper = document.querySelector(this.DOM.sliderWrapper);

        this.swiper = null;

        this.PIval = Math.PI;

        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.helixItems = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.bulletClicked = false;

        this.indexOffset = 1;

        this.getGallery();
    }

    getGallery() {
        this.items = data.output;
        this.init();

        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    init() {
        this.scene = new THREE.Scene();

        const options = {
            camera: {
                fov: 60,
                near: 10,
                far: 2000,
            },
        };

        this.camera = new THREE.PerspectiveCamera(options.camera.fov, this.winWidth / this.winHeight, options.camera.near, options.camera.far);

        this.itemRadiusOffset = 0.85;

        this.initialCameraZPosition = 970;

        if (this.winWidth < 600) {
            this.initialCameraZPosition = 1300;
        }

        this.camera.lookAt(0, 0, 0);

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = this.initialCameraZPosition;

        this.initialCameraWrapperPosition = 550;

        this.cameraWrapper = new THREE.Object3D();

        this.cameraWrapper.position.set(0, this.initialCameraWrapperPosition, 0);

        this.cameraWrapper.rotation.y = this.PIval;
        this.cameraWrapper.name = "camera wrapper";
        this.cameraWrapper.add(this.camera);
        this.scene.add(this.cameraWrapper);

        this.helix = new THREE.Object3D();

        this.scene.add(this.helix);

        this.vector = new THREE.Vector3();

        const planeBackMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            depthTest: false,
        });

        const planeBlueMaterial = new THREE.MeshBasicMaterial({
            color: 0x555555,
            transparent: true,
            opacity: 0.3,
            depthTest: false,
        });

        this.geometryAspectRatio = 1280 / 835;
        const planeGeometry = new THREE.PlaneGeometry(337, 220, 1, 1);
        let planeGeometryBack = planeGeometry.clone();
        let planeGeometryBlue = planeGeometry.clone();
        let planeGeometryOverlay = planeGeometry.clone();
        planeGeometryBack.rotateY(this.PIval);

        // create items
        for (let i = 0, l = this.items.length; i < l; i++) {
            this.createItem(
                i,
                this.items[i],
                planeGeometryBack,
                planeBackMaterial,
                planeGeometry,
                planeGeometryBlue,
                planeBlueMaterial,
                planeGeometryOverlay,
            );
        }

        const topOfTheHelix = this.helixItems[0].position.y;
        const bottomOfTheHelix = this.helixItems[this.helixItems.length - 1].position.y;
        const helixHeight = topOfTheHelix - bottomOfTheHelix;

        this.helixOffsetByItem = helixHeight / (this.helixItems.length - 1);

        // canvas renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(this.winWidth, this.winHeight);
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.shadowMap.enabled = false;
        this.gallery.appendChild(this.renderer.domElement);

        this.motionBlur();

        this.animate();

        if (is.not.mobile()) {
            this.mouseMove();
        }

        this.swiperInit();

        if (is.not.mobile()) {
            window.addEventListener(
                "resize",
                () => {
                    // height on mobile - hack
                    let vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty("--vh", `${vh}px`);

                    this.onWindowResize();
                },
                false,
            );
        }

        this.prevProgress = 0;

        if (is.not.mobile()) {
            window.addEventListener("mousewheel", (ev) => {
                if (Math.abs(ev.deltaX) > 1 || Math.abs(ev.deltaY) > 1) {
                    this.mouse.x = -1000;
                    this.mouse.y = -1000;
                }
            });
        }

        const geometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            depthTest: false,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = this.PIval;
        this.scene.add(plane);
    }

    // canvas size update
    onWindowResize() {
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;
        this.camera.aspect = this.winWidth / this.winHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.winWidth, this.winHeight);
    }

    motionBlur() {
        // Post-processing inits
        this.composer = new EffectComposer(this.renderer);
        // render pass
        const renderPass = new RenderPass(this.scene, this.camera);

        const renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            stencilBuffer: false,
        };

        // save pass
        const savePass = new SavePass(new THREE.WebGLRenderTarget(this.winWidth, this.winHeight, renderTargetParameters));

        // blend pass
        const blendPass = new ShaderPass(BlendShader, "tDiffuse1");
        blendPass.uniforms["tDiffuse2"].value = savePass.renderTarget.texture;
        blendPass.uniforms["mixRatio"].value = 0.45;

        // output pass
        const outputPass = new ShaderPass(CopyShader);
        outputPass.renderToScreen = true;

        // adding passes to composer
        this.composer.addPass(renderPass);
        this.composer.addPass(blendPass);
        this.composer.addPass(savePass);
        this.composer.addPass(outputPass);
    }

    animate() {
        if (this.swiper) {
            const swiperTranslate = this.swiper.getTranslate();

            if (!this.bulletClicked) {
                this.returnHelixItemSkew();
            }

            this.progressController();
        }

        if (is.not.mobile()) {
            this.onMouseMove();
        }

        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
        requestAnimationFrame(() => this.animate());
    }

    /**
     * on pagination click progress will not return right value, so this fallback is needed
     */
    returnHelixItemSkew() {
        for (let i = 0; i < this.helix.children.length; i++) {
            if (this.helix.children[i].name !== "sparkles") {
                gsap.to(
                    [
                        this.helix.children[i].children[0].rotation,
                        this.helix.children[i].children[1].rotation,
                        this.helix.children[i].children[2].rotation,
                        this.helix.children[i].children[3].rotation,
                    ],
                    {
                        duration: 0.5,
                        z: 0,
                        x: 0,
                        ease: "power1.out",
                    },
                );
            }
        }
    }

    /**
     *
     * @param {number} i
     * @param {object} loopItem
     * @param {THREE.Geometry} planeGeometryBack
     * @param {THREE.Material} planeBackMaterial
     * @param {THREE.Geometry} planeGeometry
     * @param {THREE.Geometry} planeGeometryBlue
     * @param {THREE.Material} planeBlueMaterial
     * @param {THREE.Geometry} planeGeometryOverlay
     */
    createItem(i, loopItem, planeGeometryBack, planeBackMaterial, planeGeometry, planeGeometryBlue, planeBlueMaterial, planeGeometryOverlay) {
        let item = document.createElement("div");
        item.className = "c-3d-spiral-gallery-item swiper-slide";

        let itemInner = document.createElement("div");
        itemInner.className = "c-3d-spiral-gallery-item__inner";
        itemInner.dataset.swiperParallaxOpacity = "-1.3";
        if (is.not.mobile()) {
            itemInner.dataset.swiperParallaxY = `-${this.winHeight * 0.4}`;
        }
        item.appendChild(itemInner);

        let itemInnerContent = document.createElement("div");
        itemInnerContent.className = "c-3d-spiral-gallery-item__inner-content";
        itemInner.appendChild(itemInnerContent);

        let title = document.createElement("div");
        title.className = "c-3d-spiral-gallery-item__title u-a3 pp-reader";
        title.textContent = loopItem.title;
        itemInnerContent.appendChild(title);

        let manufacturer = document.createElement("div");
        manufacturer.className = "c-3d-spiral-gallery-item__manufacturer u-a1 pp-reader";
        manufacturer.textContent = loopItem.manufacturer;
        itemInnerContent.appendChild(manufacturer);

        this.sliderWrapper.appendChild(item);

        let theta = i * this.itemRadiusOffset + this.PIval;
        let y = -(i * 200) + 600;

        // canvas
        const planeGroup = new THREE.Object3D();
        const texture = new THREE.TextureLoader().load(loopItem.image, () => {
            // image position to cover the plane
            this.textureCentering(texture);
        });

        const textureGray = new THREE.TextureLoader().load(loopItem.grayImage, () => {
            // image position to cover the plane
            this.textureCentering(textureGray);
        });

        const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
        });

        const planeMaterialGray = new THREE.MeshBasicMaterial({
            map: textureGray,
            transparent: true,
            depthTest: false,
        });

        planeGroup.position.setFromCylindricalCoords(570, theta, y);

        this.vector.x = planeGroup.position.x * 2;
        this.vector.y = planeGroup.position.y;
        this.vector.z = planeGroup.position.z * 2;

        const planeBack = new THREE.Mesh(planeGeometryBack, planeBackMaterial.clone());
        planeBack.name = "image back";
        const planeBlue = new THREE.Mesh(planeGeometryBlue, planeBlueMaterial.clone());
        planeBlue.name = "overlay";

        planeBlue.position.z = 0.2;

        const helixItem = new THREE.Mesh(planeGeometry, planeMaterial);
        const helixItemGray = new THREE.Mesh(planeGeometry, planeMaterialGray);
        helixItem.name = "image";
        helixItemGray.name = "gray image";
        helixItemGray.position.z = 0.1;
        planeGroup.name = `canvas-plane-${loopItem.title}, index: ${i}`;

        planeGroup.add(planeBlue);
        planeGroup.add(helixItem);
        planeGroup.add(helixItemGray);
        planeGroup.add(planeBack);

        planeGroup.lookAt(this.vector);
        this.helixItems.push(planeGroup);
        this.helix.add(planeGroup);
    }

    /**
     *
     * @param {THREE.texture} texture
     */
    textureCentering(texture) {
        const imageAspectRatio = texture.image.width / texture.image.height;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = this.geometryAspectRatio / imageAspectRatio;
        texture.offset.x = 0.5 * (1 - texture.repeat.x);
    }

    /**
     * Main swiper init
     */
    swiperInit() {
        const self = this;

        let sensitivity = is.mac() || is.not.desktop() ? 1 : 2.5;

        this.swiper = new Swiper(this.slider, {
            loop: false,
            slidesPerView: 1,
            direction: "vertical",
            centeredSlides: true,
            speed: 250,
            grabCursor: true,
            parallax: true,
            watchSlidesProgress: true,
            touchRatio: 1,
            mousewheel: {
                invert: false,
                sensitivity: sensitivity || 1,
            },
            freeMode: true,
            freeModeSticky: true,
            scrollbar: {
                el: ".js-3d-spiral-gallery-pagination-progress-wrapper",
                draggable: false,
            },
            breakpoints: {
                800: {
                    touchRatio: 1.5,
                    freeMode: true,
                    freeModeSticky: true,
                    freeModeMomentum: false,
                    freeModeMomentumRatio: 1,
                    freeModeMomentumVelocityRatio: 1,
                    freeModeMomentumBounce: false,
                    freeModeMinimumVelocity: 1,
                    direction: "horizontal",
                },
            },
            pagination: {
                el: ".js-3d-spiral-gallery-pagination",
                clickable: false,
                renderBullet: (index, className) => {
                    return `<span class="c-3d-spiral-gallery__pagination-bullet js-3d-spiral-gallery-bullet u-b2 u-uppercase pp-reader ${className}">${
                        this.items[index] ? this.items[index].nav : ""
                    }</span>`;
                },
            },
            on: {
                progress: function () {
                    self.swiper = this;

                    self.paginationProgressController(self.swiper);

                    self.dimeHelixItems(self.swiper.activeIndex);

                    if (this.bulletClicked) {
                        setTimeout(() => {
                            this.bulletClicked = false;
                        }, self.indexOffset * 0.4 * 0.6 * 1000);
                    }
                },
                slideChange: function () {
                    let swiper = this;
                    self.paginationProgressController(swiper);
                    self.indexOffset = 1;

                    self.dimeHelixItems(self.swiper.activeIndex);
                },
                slideChangeTransitionEnd: () => {
                    this.bulletClicked = false;
                    this.slider.classList.remove("is-big-offset");
                },
                init: function () {
                    let swiper = this;

                    setTimeout(() => {
                        self.paginationProgressController(swiper);
                        self.paginationController(swiper);
                    }, 100);
                },
            },
        });

        this.detectPaginationBulletClick();
    }

    /**
     * Main swiper pagination click controller
     * @param {Swiper} swiper
     */
    paginationController(swiper) {
        const bullets = swiper.pagination.bullets;
        let offset = 0;

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].addEventListener("click", () => {
                offset = Math.abs(i - swiper.activeIndex);
                this.indexOffset = offset + 1;
                let duration = offset * 250;
                if (window.innerWidth < 800) {
                    duration = 500;
                }

                swiper.slideTo(i, duration);
            });
        }
    }

    /**
     * Main swiper progress line and active bullets controller (adding one previous and one next bullet active classes)
     * @param {Swiper} swiper
     */
    paginationProgressController(swiper) {
        const index = swiper.activeIndex;
        const bullets = swiper.pagination.bullets;

        if (bullets == null) {
            return;
        }

        gsap.to(this.progressLine, {
            duration: 0.2,
            y: `${swiper.progress * 100}%`,
        });

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].classList.remove("swiper-bullet-prev");
            bullets[i].classList.remove("swiper-bullet-next");
        }

        if (bullets[index - 1]) {
            bullets[index - 1].classList.add("swiper-bullet-prev");
        }

        if (bullets[index + 1]) {
            bullets[index + 1].classList.add("swiper-bullet-next");
        }
    }

    /**
     * Main progress controller
     * Helix rotation and position
     * Text radial rotation (simulating helix position)
     * Images (planes) skew (rotation.x)
     */
    progressController() {
        let delay = 0;
        const progress = this.swiper.progress;
        const slidesLength = this.swiper.slides.length;
        let ease = "none";
        let time = this.indexOffset * 0.2;

        if (this.bulletClicked) {
            time = this.indexOffset * 0.4;
        }

        const rotationOffset = -(slidesLength - 1) * this.itemRadiusOffset * progress;
        gsap.to(this.helix.rotation, {
            duration: time,
            delay: delay,
            ease: ease,
            y: rotationOffset,
        });

        gsap.to(this.helix.position, {
            duration: time,
            ease: ease,
            y: (slidesLength - 1) * this.helixOffsetByItem * progress,
        });

        let planeSkew = progress - this.prevProgress;

        let slidePosY = 0;
        for (let i = 0; i < slidesLength; i++) {
            if (is.not.mobile()) {
                slidePosY = ((progress / (100 / (slidesLength - 1))) * 100 - i) * -50;

                if (slidePosY > 30) {
                    slidePosY = 30;
                } else if (slidePosY < -30) {
                    slidePosY = -30;
                }

                if (!this.bulletClicked) {
                    gsap.set(this.swiper.slides[i], {
                        rotateY: `${(i - (progress / (100 / (slidesLength - 1))) * 100) * 100}deg`,
                    });
                } else {
                    gsap.set(this.swiper.slides[i], {
                        rotateY: `0deg`,
                    });
                }
            }

            if (!isNaN(planeSkew)) {
                let skewTotal = -20 * planeSkew;
                let maxRatio = 0.3;

                if (this.bulletClicked) {
                    // maxRatio = 10;
                }

                if (skewTotal < -maxRatio) {
                    skewTotal = -maxRatio;
                } else if (skewTotal > maxRatio) {
                    skewTotal = maxRatio;
                }

                if (this.helix.children[i]) {
                    gsap.to(
                        [
                            this.helix.children[i].children[0].rotation,
                            this.helix.children[i].children[1].rotation,
                            this.helix.children[i].children[2].rotation,
                            this.helix.children[i].children[3].rotation,
                        ],
                        {
                            z: skewTotal / 2,
                            x: skewTotal,
                        },
                    );
                }
            }
        }

        this.prevProgress = progress;
    }

    /**
     * Dimming hleix items depending on position relative to active item
     * @param {number} index
     */
    dimeHelixItems(index) {
        const setOpacityToLeft = (passedIndex) => {
            let newIndex = passedIndex - 1;

            let opacity = 1 - (1 / 5) * (index - passedIndex);

            if (opacity < 0) {
                opacity = 0.01;
            }

            this.helixItemOpacityController(passedIndex, opacity);

            if (passedIndex > 0) {
                setOpacityToLeft(newIndex);
            }
        };

        const setOpacityToRight = (passedIndex) => {
            let newIndex = passedIndex + 1;

            if (this.helixItems[passedIndex] == null) {
                return;
            }

            let opacity = 1 - (1 / 5) * (passedIndex - index);

            if (opacity < 0) {
                opacity = 0.01;
            }

            this.helixItemOpacityController(passedIndex, opacity);

            if (this.helixItems[newIndex] != null) {
                setOpacityToRight(newIndex);
            }
        };

        setOpacityToLeft(index);
        setOpacityToRight(index + 1);
    }

    /**
     * Setting opacity to active item childs
     * @param {number} index
     * @param {number} opacity
     */
    helixItemOpacityController(index, opacity) {
        if (this.helixItems[index].children[0] && this.helixItems[index].children[0].material.opacity < 0.3) {
            gsap.to(this.helixItems[index].children[0].material, {
                opacity: "+=0.1",
            });
        }

        if (this.helixItems[index].children[3]) {
            gsap.to(this.helixItems[index].children[3].material, {
                opacity: opacity,
            });
        }
    }

    /**
     * Mousemove for THREE raycaster
     */
    mouseMove() {
        let mouseX = 1;
        this.mouse.y = 1;

        window.addEventListener("mousemove", (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            if (mouseX > 0.5) {
                mouseX = 1.5;
            } else if (mouseX < -0.5) {
                mouseX = -1.5;
            }

            this.mouse.x = mouseX;

            gsap.to(this.gradient, {
                x: -this.mouse.x * 40,
                y: this.mouse.y * 40,
                ease: "power4.out",
            });
        });

        this.onMouseMove();
    }

    /**
     * Mousemove method that uses this.mouse from mouseMove() method and its repeating in animate() method
     */
    onMouseMove() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
            this.showHelixPlanes(intersects[i].object);

            if ((intersects[i].object.name === "gray image" || intersects[i].object.name === "overlay") && !intersects[i].object.animating) {
                intersects[i].object.animating = true;
                gsap.to(intersects[i].object.material, {
                    duration: 0.3,
                    ease: "none",
                    opacity: 0,
                    onComplete: () => {
                        intersects[i].object.animating = false;
                    },
                });
            }
        }
    }

    /**
     * Showing plane childs (gray image and overlay)
     * @param {THREE.Object} currentItem
     */
    showHelixPlanes(currentItem) {
        for (let i = 0; i < this.helix.children.length; i++) {
            this.helix.children[i].hovered = this.helix.children[i] === currentItem.parent;

            if (this.helix.children[i].hovered) {
                continue;
            }

            for (let j = 0; j < this.helix.children[i].children.length; j++) {
                if (
                    !this.helix.children[i].hovered &&
                    this.helix.children[i].children[j] !== currentItem &&
                    this.helix.children[i].children[j].material.opacity < 0.3 &&
                    !this.helix.children[i].children[j].animating &&
                    (this.helix.children[i].children[j].name === "overlay" || this.helix.children[i].children[j].name === "gray image")
                ) {
                    this.helix.children[i].children[j].animating = true;
                    let opacity = 1;
                    if (this.helix.children[i].children[j].name === "overlay") {
                        opacity = 0.3;
                    }

                    gsap.to(this.helix.children[i].children[j].material, {
                        duration: 0.5,
                        opacity: opacity,
                        onComplete: () => {
                            this.helix.children[i].children[j].animating = false;
                        },
                    });
                }
            }
        }
    }

    /**
     * Detection for bullet click is needed for slides transition (it glitches without some restrictions)
     */
    detectPaginationBulletClick() {
        let bullets = document.querySelectorAll(this.DOM.sliderPaginationBullet);

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].addEventListener("click", () => {
                this.bulletClicked = true;

                if (Math.abs(i - this.swiper.activeIndex) > 1) {
                    this.slider.classList.add("is-big-offset");
                }
            });
        }
    }
}

import gsap from "gsap";
import {ScrollTrigger} from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import ScrollMarquee from "../examples/3dScrollytelling/ScrollMarquee";

export default class PetPakAwwwards {
    constructor() {
        this.DOM = {
            modelContainer: ".js-petpak-scroll-canvas",
            scrollNext: ".js-petpak-next",
            section: ".js-petpak-scroll-section",
            mainWrapper: ".js-petpak-scroll",
            title: ".js-petpak-title",
        };

        // config
        this.config = {
            environment: {
                scale: 16,
            },
        };

        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        this.title = document.querySelector(this.DOM.title);
        this.xOffset = 10;
        this.firstXPos = 5 * this.config.environment.scale;

        ScrollTrigger.matchMedia({
            "(max-width: 800px)": () => {
                this.xOffset = 0;
                this.firstXPos = 0;
            },
        });

        this.models = [];

        this.coeff = 100;
        this.coeff2 = 100;
        this.gap = 1.5;
        this.thespeed = 7;
        this.spacing = 533;
    }

    /**
     * main init - all dom elements and method calls
     */
    init() {
        if (this.modelContainer !== null) {
            this.setDimensions();

            const scrollMarquee = new ScrollMarquee();
            scrollMarquee.init();

            gsap.set(this.title, {
                autoAlpha: 0,
            });

            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "manual";
            }

            console.log("ModelScrollSections init()");

            THREE.Cache.enabled = true;

            this.initCamera();
            this.initScene();
            this.initLights();
            this.initRenderer();

            let waitModels = new Promise((resolve, reject) => {
                this.throughSections(resolve);
            });

            waitModels.then(() => {
                this.scrollController();
                this.animate();

                this.models.filter((model) => {
                    if (model.index !== 0) {
                        this.modelHide(model.model, true, false);
                    } else {
                        gsap.set(this.title, {
                            autoAlpha: 1,
                        });

                        gsap.fromTo(
                            model.model.position,
                            {
                                y: 20 * this.config.environment.scale,
                                x: this.firstXPos,
                                z: 0,
                            },
                            {
                                y: 0,
                                x: this.firstXPos,
                                z: 0,
                                duration: 1,
                                delay: 0.5,
                                ease: "power3.out",
                            },
                        );

                        gsap.fromTo(
                            model.model.rotation,
                            {
                                z: -0.3,
                                y: -0.9,
                            },
                            {
                                z: 0.17,
                                y: -0.3,
                                duration: 1,
                                delay: 0.5,
                                ease: "power3.out",
                            },
                        );
                    }
                });
            });

            // handle resize
            ScrollTrigger.matchMedia({
                "(min-width: 801px)": () => {
                    window.addEventListener("resize", () => this.onWindowResize(), false);
                },
            });
        }
    }

    /**
     * camera setup
     */
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            35,
            this.width / this.height,
            0.5 * this.config.environment.scale,
            130 * this.config.environment.scale,
        );

        ScrollTrigger.matchMedia({
            "(min-width: 801px)": () => {
                this.camera?.position.set(2.5 * this.config.environment.scale, 0, 32 * this.config.environment.scale);
            },
            "(max-width: 800px)": () => {
                this.camera?.position.set(0, 0, 40 * this.config.environment.scale);
            },
        });
    }

    /**
     * scene setup
     */
    initScene() {
        this.scene = new THREE.Scene();
    }

    /**
     * lights setup - because of performance > all in one object
     */
    initLights() {
        const lightWrapper = new THREE.Object3D();

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
        hemiLight.position.set(0, 200 * this.config.environment.scale, 0);

        this.ambientLight = new THREE.AmbientLight(0x404040);

        // this is just back light - without it back side of model would be barely visible
        this.dirSubLight = new THREE.DirectionalLight(0xcccccc, 1);
        this.dirSubLight.position.set(-20 * this.config.environment.scale, 20 * this.config.environment.scale, -20 * this.config.environment.scale);

        this.dirLight = new THREE.DirectionalLight(0xcccccc, 3.5);
        this.dirLight.position.set(20 * this.config.environment.scale, 30 * this.config.environment.scale, 10 * this.config.environment.scale);

        lightWrapper.add(this.dirLight);
        lightWrapper.add(this.dirSubLight);
        lightWrapper.add(this.ambientLight);
        lightWrapper.add(hemiLight);

        this.scene.add(lightWrapper);
    }

    /**
     * renderer setup
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.physicallyCorrectLights = true;
        this.modelContainer.appendChild(this.renderer.domElement);
    }

    /**
     * go through sections and load models
     * @param {response} resolve
     */
    throughSections(resolve) {
        this.sections = document.querySelectorAll(this.DOM.section);

        if (this.sections.length < 1) {
            return;
        }

        this.sections.forEach((section, index) => {
            const textureUrl = section.dataset.texture;
            this.initModel(index, resolve, textureUrl);
        });
    }

    /**
     *
     * model setup and load call
     * @param {number} index
     * @param {response} resolve
     * @param {string} textureUrl
     */
    initModel(index, resolve, textureUrl) {
        let model = null;
        this.loaderInner(textureUrl, model, index, resolve);
    }

    loaderInner(textureUrl, model, index, resolve) {
        const texture = new THREE.TextureLoader().load(textureUrl);
        const geometry = new THREE.PlaneGeometry(130, 172, 50, 50);
        geometry.computeVertexNormals();
        const material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        const mesh = new THREE.Mesh(geometry, material);

        this.loadModel(mesh, index);
        model = mesh;

        this.models.push({ model, index });

        mesh.modelScale = 1;

        this.scene.add(mesh);

        this.dirLight.updateMatrix();
        this.dirSubLight.updateMatrix();
        this.ambientLight.updateMatrix();

        if (this.models.length === this.sections.length) {
            setTimeout(() => {
                resolve();
            }, 100);
        }
    }

    /**
     * model loading and controller call
     * @param [object] object
     */
    loadModel(object, index) {
        if (object.isMesh) {
            const box = new THREE.Box3().setFromObject(object);
            let z = Math.abs(box.min.z);

            if (z === 0) {
                z = -Math.abs(box.max.z);
            }

            object.geometry.translate(0, 0, z / 2);
            object.castShadow = false;
            object.material.refractionRatio = 0;
            object.material.reflectivity = 0;
            object.material.roughness = 0.7;
            object.material.clearcoat = 0;
            object.material.clearcoatRoughness = 0.5;
            object.material.opacity = 1;
            object.material.transparent = false;
            object.material.envMap = null;
            object.material.side = 2;
            object.material.metalness = 0;
            object.material.depthFunc = false;
            object.material.color.convertSRGBToLinear();
        }
    }

    /**
     * resize controller
     */
    onWindowResize() {
        this.setDimensions();
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    /**
     * requestAnimationFrame
     */
    animate() {
        this.renderer.render(this.scene, this.camera);

        if (this.models.length > 0) {
            this.models.forEach((model) => {
                this.update(model.model);
            });
        }

        if (this.renderer != null) {
            requestAnimationFrame(() => this.animate());
        }
    }

    /**
     * scrollTrigger
     */
    scrollController() {
        // sort by index
        this.models.sort((a, b) => {
            return a.index - b.index;
        });

        this.models.forEach((model, index) => {
            const direction = this.checkDirection(this.sections[model.index].dataset.position);
            let nextDirection = 0;

            if (this.sections[index + 1] != null) {
                nextDirection = this.checkDirection(this.sections[index + 1].dataset.position);
            }

            model.direction = direction;

            this.changeModelPosition(direction, nextDirection, model);

            gsap.to(model.model.rotation, {
                scrollTrigger: {
                    trigger: this.sections[model.index],
                    start: "top 50%",
                    end: `bottom ${model.index === this.sections.length - 1 ? "top" : "50%"}`,
                    scrub: true,
                    onEnter: () => {
                        this.modelShow(model.model);
                    },
                    onLeave: () => {
                        this.modelHide(model.model, model.index !== this.models.length - 1, true);
                    },
                    onEnterBack: () => {
                        this.modelShow(model.model);
                    },
                    onLeaveBack: () => {
                        this.modelHide(model.model, model.index !== 0, true);
                    },
                },
                ease: "none",
            });
        });
    }

    update(model) {
        this.time = performance.now() * 0.001 * (this.thespeed / 10);
        for (let i = 0; i < model.geometry.vertices.length; i++) {
            let p = model.geometry.vertices[i];
            p.z = 1 + (this.spacing / 25) * noise.perlin2(p.x * (this.gap / this.coeff) + this.time, p.y * (this.gap / this.coeff2));
        }
        model.geometry.verticesNeedUpdate = true; //must be set or vertices will not update
        model.geometry.computeVertexNormals();
    }

    /**
     *
     * @param {string} direction
     * @returns {number}
     */
    // -1 = left
    // 0 = center
    // 1 = right
    checkDirection(direction) {
        switch (direction) {
            case "left":
                return -1;
            case "right":
                return 1;
            default:
                return 0;
        }
    }

    /**
     *
     * @param {number} current
     * @param {number} next
     * @param {Object} model
     */
    changeModelPosition(current, next, model) {
        let fromCurrent = current === 1 ? current * 1.5 : current;
        let toNext = next === 1 ? next * 1.5 : next;

        if (current === 0) {
            fromCurrent = 0.3;
        }

        if (next === 0) {
            toNext = 0.3;
        }

        this.models.filter((modelSingle) => {
            let tl = gsap
                .timeline({
                    // ease: "power4.inOut",
                    scrollTrigger: {
                        trigger: this.sections[model.index],
                        start: `top top`,
                        end: "bottom top",
                        scrub: true,
                    },
                })
                .addLabel("start")
                .add("start")
                .fromTo(
                    modelSingle.model.position,
                    {
                        x: model.index === 0 ? this.firstXPos : this.xOffset * this.config.environment.scale * fromCurrent,
                    },
                    {
                        x: this.xOffset * this.config.environment.scale * toNext,
                        ease: "none",
                        duration: 2,
                    },
                    "start",
                )
                .fromTo(
                    modelSingle.model.position,
                    {
                        z: 0,
                    },
                    {
                        z: -100,
                        ease: "none",
                        duration: 1,
                    },
                    "start",
                )
                .fromTo(
                    modelSingle.model.position,
                    {
                        z: -100,
                    },
                    {
                        z: 0,
                        ease: "none",
                        duration: 1,
                    },
                    "-=1",
                )
                .addLabel("end");

            gsap.fromTo(
                modelSingle.model.rotation,
                {
                    z: -0.17 * current,
                    y: model.index === 0 ? -0.3 : current * -0.6,
                },
                {
                    z: -0.17 * next,
                    y: model.index === this.sections.length - 1 ? -0.6 : next * -0.6,
                    ease: "none",
                    scrollTrigger: {
                        trigger: this.sections[model.index],
                        start: `top top`,
                        end: "bottom top",
                        scrub: true,
                    },
                },
            );

            gsap.set(modelSingle.model.position, {
                x: model.index === 0 ? 0 : this.xOffset * this.config.environment.scale * this.models[0].direction,
            });
        });
    }

    /**
     *
     * @param {Object} model
     * @param {boolean} hide
     * @param {boolean} duration
     */
    modelHide(model, hide = true, duration) {
        if (hide === false) {
            return;
        }

        gsap.to(model.material, {
            opacity: 0,
            duration: duration ? 0.1 : 0,
            overwrite: true,
            onComplete: () => {
                model.visible = false;
            },
        });
    }

    /**
     *
     * @param {Object} model
     */
    modelShow(model) {
        gsap.to(model.material, {
            opacity: 1,
            duration: 0.2,
            ease: "none",
            overwrite: true,
            onStart: () => {
                model.visible = true;
            },
        });
    }

    /**
     * setting canvas dimensions [this.width & this.height]
     */
    setDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
}

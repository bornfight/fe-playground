import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import ScrollMarquee from "../3dScrollytelling/ScrollMarquee";

export default class PetPakAwwwards {
    constructor() {
        this.DOM = {
            modelContainer: ".js-petpak-scroll-canvas",
            scrollNext: ".js-petpak-next",
            section: ".js-petpak-scroll-section",
            mainWrapper: ".js-petpak-scroll",
            title: ".js-petpak-title",
        };

        this.models = [];

        this.scrollTop = false;

        // config
        this.config = {
            environment: {
                scale: 16,
            },
        };

        this.coeff = 72;
        this.coeff2 = 72;
        this.gap = 1;
        this.thespeed = 12;
        this.spacing = 533;
    }

    /**
     * main init - all dom elements and method calls
     */
    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            this.setDimensions();

            const scrollMarquee = new ScrollMarquee();
            scrollMarquee.init();

            this.title = document.querySelector(this.DOM.title);
            this.scrollNext = document.querySelector(this.DOM.scrollNext);
            this.xOffset = this.width > 800 ? 10 : 5;

            this.infos = [];

            gsap.set(this.title, {
                autoAlpha: 0,
            });

            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "manual";
            }

            console.log("ModelScrollSections init()");

            THREE.Cache.enabled = true;

            // reflection map
            const path = window.modelMaps;
            const mapUrls = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg", path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];

            this.cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
            this.cubeMap.format = THREE.RGBFormat;
            this.cubeMap.encoding = THREE.sRGBEncoding;

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
                this.checkScroll();
                this.modelInfoScrollTilt();

                this.models.filter((model) => {
                    if (model.index !== 0) {
                        this.modelHide(model.model, true, false);
                    } else {
                        gsap.set(this.title, {
                            autoAlpha: 1,
                        });

                        gsap.fromTo(
                            this.title,
                            {
                                y: "40%",
                                autoAlpha: 0,
                            },
                            {
                                y: "0%",
                                autoAlpha: 1,
                                ease: "power2.out",
                                duration: 1.5,
                                stagger: 0.15,
                            },
                        );

                        gsap.fromTo(
                            model.model.position,
                            {
                                x: 30 * this.config.environment.scale,
                                z: 0,
                            },
                            {
                                x: this.xOffset * this.config.environment.scale * model.direction,
                                z: 0,
                                duration: 1,
                                delay: 0.5,
                                ease: "power3.out",
                            },
                        );

                        gsap.fromTo(
                            model.model.rotation,
                            {
                                y: -Math.PI * 2,
                                z: 0.17,
                            },
                            {
                                y: 0,
                                z: -0.17,
                                duration: 1,
                                delay: 0.5,
                                ease: "power3.out",
                            },
                        );

                        if (this.scrollNext) {
                            gsap.to(this.scrollNext, {
                                autoAlpha: 1,
                                delay: 1,
                            });
                        }
                    }
                });
            });

            // handle resize
            if (window.innerWidth > 800) window.addEventListener("resize", () => this.onWindowResize(), false);
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

        if (this.width > 800) {
            this.camera.position.set(0, -1 * this.config.environment.scale, 32 * this.config.environment.scale);
        } else {
            this.camera.position.set(0, 0, 26 * this.config.environment.scale);
        }
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
            const modelScale = section.dataset.modelScale;
            this.initModel(index, resolve, modelScale);
        });
    }

    /**
     *
     * model setup and load call
     * @param {number} index
     * @param {response} resolve
     * @param {number} modelScale
     */
    initModel(index, resolve, modelScale = 1) {
        let model = null;
        this.loaderInner(modelScale, model, index, resolve);
    }

    loaderInner(modelScale, model, index, resolve) {
        const geometry = new THREE.PlaneGeometry(130, 172, 50, 50);
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        this.loadModel(mesh, index);
        model = mesh;

        this.models.push({ model, index });

        mesh.modelScale = modelScale;

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
            const isTransparent = index % 2 === 0;

            if (z === 0) {
                z = -Math.abs(box.max.z);
            }

            object.geometry.translate(0, 0, z / 2);
            object.material.color.set(0x41557f);
            object.material.emissive.set(0x1e335d);
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
                        this.modelShow(model.model, model.model.modelScale);
                    },
                    onLeave: () => {
                        this.modelHide(model.model, model.index !== this.models.length - 1, true);
                    },
                    onEnterBack: () => {
                        this.modelShow(model.model, model.model.modelScale);
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
        let rotation = model.index === this.sections.length - 1 ? -2 : -1;

        if (current > next) {
            rotation = model.index === this.sections.length - 1 ? 2 : 1;
        }

        this.models.filter((modelSingle) => {
            let tl = gsap
                .timeline({
                    // ease: "power4.inOut",
                    scrollTrigger: {
                        trigger: this.sections[model.index],
                        start: `${model.index === 0 ? "top" : "top"} top`,
                        end: "bottom top",
                        scrub: true,
                    },
                })
                .addLabel("start")
                .add("start")
                .fromTo(
                    modelSingle.model.position,
                    {
                        x: this.xOffset * this.config.environment.scale * current,
                    },
                    {
                        x: this.xOffset * this.config.environment.scale * next,
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
                    z: -0.17,
                    y: 0,
                },
                {
                    z: -0.17,
                    y: Math.PI * 2 * (this.scrollTop ? -1 : 1) * rotation,
                    ease: "none",
                    scrollTrigger: {
                        trigger: this.sections[model.index],
                        start: `${model.index === 0 ? "top" : "top"} top`,
                        end: "bottom top",
                        scrub: true,
                    },
                },
            );

            gsap.set(modelSingle.model.position, {
                x: this.xOffset * this.config.environment.scale * this.models[0].direction,
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

        gsap.to(model.scale, {
            x: 1,
            y: 1,
            z: 1,
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
     * @param {number} model
     */
    modelShow(model, modelScale) {
        gsap.to(model.scale, {
            x: modelScale,
            y: modelScale,
            z: modelScale,
            duration: 0.1,
            delay: 0.08,
            ease: "none",
            overwrite: true,
            onStart: () => {
                model.visible = true;
            },
        });
    }

    /**
     * check scroll position
     */
    checkScroll() {
        let currentTop = window.pageYOffset | document.body.scrollTop;
        let pervTop = 0;
        document.addEventListener("scroll", () => {
            currentTop = window.pageYOffset | document.body.scrollTop;
            this.scrollTop = pervTop >= currentTop;
        });
    }

    /**
     * scroll controller for model info lines
     * @param {Array} info
     * @param {number} index
     */
    modelInfoController(info, index) {
        this.infos.push(info.querySelector(".js-inner-model-info"));

        gsap.to(info, {
            scrollTrigger: {
                trigger: info,
                start: `top ${index === 0 ? "90%" : "40%"}`,
                end: `bottom 20%`,
                scrub: 0.8,
                onEnter: () => {
                    gsap.to(info, {
                        autoAlpha: 1,
                        y: "0%",
                        duration: 0.6,
                        delay: `${index === 0 ? "0.6" : "0"}`,
                    });
                },
                onLeave: () => {
                    gsap.to(info, {
                        autoAlpha: 0,
                        y: "50%",
                    });
                },
                onEnterBack: () => {
                    gsap.to(info, {
                        autoAlpha: 1,
                        y: "0%",
                        duration: 0.6,
                    });
                },
                onLeaveBack: () => {
                    gsap.to(info, {
                        autoAlpha: 0,
                        y: "50%",
                    });
                },
            },
            ease: "none",
        });
    }

    /**
     * model info tilt on mouse move (+ model tilt)
     */
    modelInfoScrollTilt() {
        if (this.width < 801) {
            return;
        }

        window.addEventListener("mousemove", (ev) => {
            const xAmount = (ev.clientX / window.innerWidth - 0.5) * 5;
            const yAmount = (ev.clientY / window.innerHeight - 0.5) * 5;

            if (this.infos.length > 0) {
                gsap.to(this.infos, {
                    x: `${xAmount}vw`,
                    y: `${yAmount}vw`,
                    ease: "power4.out",
                });
            }

            gsap.to(this.modelContainer, {
                x: `${-xAmount * 0.5}vw`,
                y: `${-yAmount * 0.5}vw`,
                ease: "power4.out",
            });

            gsap.to([this.title, ".js-scroll-next"], {
                x: `${xAmount * 0.1}vw`,
                y: `${yAmount * 0.1}vw`,
                ease: "power4.out",
            });
        });
    }

    /**
     * setting canvas dimensions [this.width & this.height]
     */
    setDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        if (this.width <= 800) {
            this.height = window.innerWidth;
        }
    }
}

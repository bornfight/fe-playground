import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import ScrollMarquee from "./ScrollMarquee";

export default class ThreeScrollytelling {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-scroll-canvas",
            section: ".js-model-scroll-section",
            mainWrapper: ".js-model-scroll",
        };

        this.models = [];

        this.scrollTop = false;

        // config
        this.config = {
            environment: {
                scale: 16,
            },
        };
    }

    /**
     * main init - all dom elements and method calls
     */
    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "manual";
            }

            const scrollMarquee = new ScrollMarquee();
            scrollMarquee.init();

            console.log("ModelScrollSections init()");

            THREE.Cache.enabled = true;

            this.width = window.innerWidth;
            this.height = window.innerHeight;

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

                this.models.filter((model) => {
                    if (model.index !== 0) {
                        this.modelHide(model.model, true);
                    } else {
                        gsap.fromTo(
                            model.model.position,
                            {
                                x: 450,
                                z: 0,
                            },
                            {
                                x: 150 * model.direction,
                                z: 0,
                                duration: 0.8,
                                delay: 0.3,
                                ease: "power4.out",
                            },
                        );

                        gsap.fromTo(
                            model.model.rotation,
                            {
                                z: -Math.PI * 2,
                            },
                            {
                                z: 0,
                                duration: 0.8,
                                delay: 0.3,
                                ease: "power4.out",
                            },
                        );
                    }
                });
            });

            // handle resize
            window.addEventListener("resize", () => this.onWindowResize(), false);
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
        this.camera.position.set(0, 0, 40 * this.config.environment.scale);
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
     */
    throughSections(resolve) {
        this.sections = document.querySelectorAll(this.DOM.section);

        if (this.sections.length < 1) {
            return;
        }

        this.sections.forEach((section, index) => {
            const modelUrl = section.dataset.model;
            const modelName = section.dataset.name;
            if (modelUrl !== "" && modelUrl != null) {
                this.initModel(modelUrl, index, resolve, modelName);
            }
        });
    }

    /**
     * model setup and load call
     */
    initModel(modelUrl, index, resolve, modelName) {
        let model = null;

        // loader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./../../static/js/draco/');
        dracoLoader.setDecoderConfig({
            type: "js",
        });

        dracoLoader.load(modelUrl, (geometry) => {
            geometry.computeVertexNormals();
            const material = new THREE.MeshStandardMaterial();
            const mesh = new THREE.Mesh(geometry, material);

            this.loadModel(mesh);
            model = mesh;

            this.models.push({ model, index });

            mesh.name = modelName;

            this.scene.add(mesh);

            dracoLoader.dispose();

            this.dirLight.updateMatrix();
            this.dirSubLight.updateMatrix();
            this.ambientLight.updateMatrix();

            if (index === this.sections.length - 1) {
                setTimeout(() => {
                    resolve();
                }, 100);
            }
        });
    }

    /**
     * moadel loading and controller call
     * @param [object] object
     */
    loadModel(object) {
        if (object.isMesh) {
            const box = new THREE.Box3().setFromObject(object);
            let z = Math.abs(box.min.z);

            if (z === 0) {
                z = -Math.abs(box.max.z);
            }

            object.geometry.translate(0, 0, z / 2);
            object.rotation.x = Math.PI / 2;
            object.castShadow = true;
            // object.material.side = 2;
            // object.material.shadowSide = 1;
            object.material.emissive.set(0x020000);
            object.material.metalness = 0;
            // object.material.opacity = 0.3;
            object.material.depthFunc = false;
            // object.material.depthWrite = true;
            object.material.transparent = false;
            object.material.color.set(0x000dff);
            object.material.color.convertSRGBToLinear();
            // // object.matrixAutoUpdate = false;
            // // object.material.needsUpdate = false;
            object.material.envMap = this.cubeMap;
            object.material.refractionRatio = 1;
            object.material.reflectivity = 1;
            object.material.roughness = 0;
            object.material.clearcoat = 1;
            object.material.clearcoatRoughness = 0;
        }
    }

    /**
     *
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * requestAnimationFrame
     */
    animate() {
        this.renderer.render(this.scene, this.camera);
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
                        this.modelHide(model.model, model.index !== this.models.length - 1);
                    },
                    onEnterBack: () => {
                        this.modelShow(model.model);
                    },
                    onLeaveBack: () => {
                        this.modelHide(model.model, model.index !== 0);
                    },
                },
                ease: "none",
            });
        });
    }

    /**
     *
     * @param direction
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
     * @param current
     * @param next
     * @param model
     */
    changeModelPosition(current, next, model) {
        let rotation = model.index === this.sections.length - 1 ? -2 : -1;

        if (current > next) {
            rotation = model.index === this.sections.length - 1 ? 2 : 1;
        }

        this.models.filter((modelSingle) => {
            if (modelSingle.index === model.index) {
                modelSingle.endTilt = 0.25 * current;
            }
        });

        this.models.filter((modelSingle) => {
            if (modelSingle.index === model.index + 1) {
                modelSingle.startTilt = model.endTilt;
            }
        });

        this.models.filter((modelSingle) => {
            let tl = gsap
                .timeline({
                    // ease: "none",
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
                        x: 150 * current,
                    },
                    {
                        x: 150 * next,
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
                        z: 150,
                        ease: "none",
                        duration: 1,
                    },
                    "start",
                )
                .fromTo(
                    modelSingle.model.position,
                    {
                        z: 150,
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
                    y: modelSingle.index === 0 ? 0 : model.startTilt || 0,
                    z: 0,
                },
                {
                    y: model.endTilt || 0,
                    z: Math.PI * 2 * (this.scrollTop ? -1 : 1) * rotation,
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
                x: 150 * this.models[0].direction,
            });
        });
    }

    /**
     *
     * @param model
     * @param hide
     */
    modelHide(model, hide = true) {
        if (hide === false) {
            return;
        }

        gsap.set(model.material, {
            opacity: 0.7,
            overwrite: true,
            onComplete: () => {
                model.visible = false;
            },
        });
    }

    /**
     *
     * @param model
     */
    modelShow(model) {
        gsap.to(model.material, {
            opacity: 1,
            duration: 0.3,
            ease: "none",
            overwrite: true,
            onStart: () => {
                model.visible = true;
            },
        });
    }

    checkScroll() {
        let currentTop = window.pageYOffset | document.body.scrollTop;
        let pervTop = 0;
        document.addEventListener("scroll", () => {
            currentTop = window.pageYOffset | document.body.scrollTop;
            this.scrollTop = pervTop >= currentTop;
        });
    }
}

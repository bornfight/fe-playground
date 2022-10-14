import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

export default class WatchConfigurator {
    constructor() {
        this.DOM = {
            container: ".js-watch-configurator",
            canvas: ".js-watch-configurator-canvas",
        };

        // config
        this.config = {
            colors: {
                needles: 0xffffff,
                frame: 0x333333,
                knob: 0xffffff,
                button: 0x999999,
                holders: 0xff88ff,
                screen: 0xff88ff,
            },
        };
    }

    /**
     * main init - all dom elements and method calls
     */
    init() {
        this.container = document.querySelector(this.DOM.container);
        if (this.container !== null) {
            console.log("WatchConfigurator init()");

            THREE.Cache.enabled = true;

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.initCamera();
            this.initScene();
            this.initLights();
            this.initRenderer();
            this.initModel();
            this.animate();
            this.initTable();
            this.mouseMove();

            this.gui = new dat.GUI();

            // handle resize
            window.addEventListener("resize", () => this.onWindowResize(), false);
        }
    }

    mouseMove() {
        window.addEventListener("mousemove", (ev) => {
            let mouseX = ev.clientX;
            let mouseY = ev.clientY;

            gsap.to(this.camera.position, {
                y: -4 - (mouseY - window.innerHeight / 2) / 400,
                x: 8 + (mouseX - window.innerWidth / 2) / 400,
            });
        });
    }

    /**
     * camera setup
     */
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5, 100);
        this.camera.position.set(8, -4, 12);
        // this.camera.rotation.set(0.5, 0.4, 0.55);
        this.camera.lookAt(0, 0, 0);
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

        const hemiLight = new THREE.HemisphereLight(0x999999, 0x444444);
        hemiLight.position.set(10, 10, 20);

        this.ambientLight = new THREE.AmbientLight(0xcccccc);

        // this is just back light - without it back side of model would be barely visible
        this.dirSubLight = new THREE.DirectionalLight(0xcccccc, 1);
        this.dirSubLight.position.set(0, 0, 10);

        this.dirLight = new THREE.DirectionalLight(0xcccccc, 1);
        this.dirLight.position.set(-4, -4, 10);
        this.dirLight.castShadow = true;

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
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.physicallyCorrectLights = true;
        this.container.appendChild(this.renderer.domElement);
    }

    initTable() {
        const textureLoader = new THREE.TextureLoader();
        console.log(this.container.dataset.ambient);
        const material = new THREE.MeshStandardMaterial({
            // roughness: 0.4,
            // metalness: 1.0,
            map: textureLoader.load(this.container.dataset.texture),
            bumpMap: textureLoader.load(this.container.dataset.depth),
            bumpScale: 0.09,
            // normalMap: textureLoader.load(this.container.dataset.normal),
            aoMap: textureLoader.load(this.container.dataset.ambient),
            aoMapIntensity: 0.25,
            displacementMap: textureLoader.load(this.container.dataset.displacement),
            displacementScale: 0.25,
            displacementBias: 0.3,
        });

        const geometry = new THREE.PlaneBufferGeometry(30, 30, 500, 500);
        const plane = new THREE.Mesh(geometry, material);
        plane.position.z = -0.7;
        plane.rotation.y = 0.3;
        plane.rotation.x = -0.3;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    /**
     * model setup and load call
     */
    initModel() {
        const loader = new GLTFLoader();

        // loader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://threejs.org/examples/js/libs/draco/");
        dracoLoader.setDecoderConfig({
            type: "js",
        });
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            this.container.dataset.modelUrl,
            (gltf) => {
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;

                        console.log(node.name);

                        if (node.name === "Hours" || node.name === "Minutes") {
                            node.material.color.set(this.config.colors.needles);
                        }

                        if (node.name === "Screen") {
                            node.material = new THREE.MeshPhongMaterial();
                            node.receiveShadow = true;
                        }
                    }
                });

                gsap.to(gltf.scene.children.find((item) => item.name === "Minutes").rotation, {
                    x: -Math.PI * 2,
                    duration: 10,
                    ease: "none",
                    repeat: -1,
                });

                gsap.to(gltf.scene.children.find((item) => item.name === "Hours").rotation, {
                    x: -Math.PI * 2,
                    duration: 120,
                    ease: "none",
                    repeat: -1,
                });

                gltf.scene.rotation.y = -Math.PI / 2 + 0.3;
                gltf.scene.rotation.x = -0.3;

                this.scene.add(gltf.scene);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); /**/
            },
            (error) => {
                console.log("An error happened");
            },
        );
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
}

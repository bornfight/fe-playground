(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _ScrollTrigger = _interopRequireDefault(require("gsap/ScrollTrigger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap.default.registerPlugin(_ScrollTrigger.default);

var ScrollMarquee = /*#__PURE__*/function () {
  function ScrollMarquee() {
    _classCallCheck(this, ScrollMarquee);

    this.DOM = {
      mainWrapper: ".js-scroll-marquee",
      topLine: ".js-scroll-marquee-top",
      bottomLine: ".js-scroll-marquee-bottom"
    };
    this.mainWrappers = document.querySelectorAll(this.DOM.mainWrapper);
  }

  _createClass(ScrollMarquee, [{
    key: "init",
    value: function init() {
      var _this = this;

      if (this.mainWrappers.length < 1) {
        return;
      }

      this.mainWrappers.forEach(function (wrapper) {
        _this.singleLine(wrapper);
      });
    }
  }, {
    key: "singleLine",
    value: function singleLine(wrapper) {
      var topLine = wrapper.querySelector(this.DOM.topLine);
      var bottomLine = wrapper.querySelector(this.DOM.bottomLine);

      if (topLine != null) {
        this.animateLine(topLine, 1, wrapper);
      }

      if (bottomLine != null) {
        this.animateLine(bottomLine, -1, wrapper);
      }

      _ScrollTrigger.default.create({
        trigger: wrapper,
        pin: true,
        start: "top top",
        end: "150%",
        onEnter: function onEnter() {
          console.log("enter");
        }
      });
    }
  }, {
    key: "animateLine",
    value: function animateLine(line, direction, wrapper) {
      var start = -(line.offsetWidth - window.innerWidth);
      var end = 0;

      if (direction === -1) {
        start = 0;
        end = -(line.offsetWidth - window.innerWidth);
      }

      _gsap.default.fromTo(line, {
        x: start
      }, {
        x: end,
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          end: "bottom+=".concat(wrapper.offsetHeight * 1, " top"),
          scrub: 1
        },
        ease: "none"
      });
    }
  }]);

  return ScrollMarquee;
}();

exports.default = ScrollMarquee;

},{"gsap":"gsap","gsap/ScrollTrigger":"gsap/ScrollTrigger"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _ScrollTrigger = _interopRequireDefault(require("gsap/ScrollTrigger"));

var _DRACOLoader = require("three/examples/jsm/loaders/DRACOLoader");

var _ScrollMarquee = _interopRequireDefault(require("./ScrollMarquee"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap.default.registerPlugin(_ScrollTrigger.default);

var ThreeScrollytelling = /*#__PURE__*/function () {
  function ThreeScrollytelling() {
    _classCallCheck(this, ThreeScrollytelling);

    this.DOM = {
      modelContainer: ".js-model-scroll-canvas",
      section: ".js-model-scroll-section",
      mainWrapper: ".js-model-scroll"
    };
    this.models = [];
    this.scrollTop = false; // config

    this.config = {
      environment: {
        scale: 16
      }
    };
  }
  /**
   * main init - all dom elements and method calls
   */


  _createClass(ThreeScrollytelling, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.modelContainer = document.querySelector(this.DOM.modelContainer);

      if (this.modelContainer !== null) {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }

        var scrollMarquee = new _ScrollMarquee.default();
        scrollMarquee.init();
        console.log("ModelScrollSections init()");
        THREE.Cache.enabled = true;
        this.width = window.innerWidth;
        this.height = window.innerHeight; // reflection map

        var path = window.modelMaps;
        var mapUrls = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg", path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];
        this.cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
        this.cubeMap.format = THREE.RGBFormat;
        this.cubeMap.encoding = THREE.sRGBEncoding;
        this.initCamera();
        this.initScene();
        this.initLights();
        this.initRenderer();
        var waitModels = new Promise(function (resolve, reject) {
          _this.throughSections(resolve);
        });
        waitModels.then(function () {
          _this.scrollController();

          _this.animate();

          _this.checkScroll();

          _this.models.filter(function (model) {
            if (model.index !== 0) {
              _this.modelHide(model.model, true);
            } else {
              _gsap.default.fromTo(model.model.position, {
                x: 450,
                z: 0
              }, {
                x: 150 * model.direction,
                z: 0,
                duration: 0.8,
                delay: 0.3,
                ease: "power4.out"
              });

              _gsap.default.fromTo(model.model.rotation, {
                z: -Math.PI * 2
              }, {
                z: 0,
                duration: 0.8,
                delay: 0.3,
                ease: "power4.out"
              });
            }
          });
        }); // handle resize

        window.addEventListener("resize", function () {
          return _this.onWindowResize();
        }, false);
      }
    }
    /**
     * camera setup
     */

  }, {
    key: "initCamera",
    value: function initCamera() {
      this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5 * this.config.environment.scale, 130 * this.config.environment.scale);
      this.camera.position.set(0, 0, 40 * this.config.environment.scale);
    }
    /**
     * scene setup
     */

  }, {
    key: "initScene",
    value: function initScene() {
      this.scene = new THREE.Scene();
    }
    /**
     * lights setup - because of performance > all in one object
     */

  }, {
    key: "initLights",
    value: function initLights() {
      var lightWrapper = new THREE.Object3D();
      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
      hemiLight.position.set(0, 200 * this.config.environment.scale, 0);
      this.ambientLight = new THREE.AmbientLight(0x404040); // this is just back light - without it back side of model would be barely visible

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

  }, {
    key: "initRenderer",
    value: function initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: true
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

  }, {
    key: "throughSections",
    value: function throughSections(resolve) {
      var _this2 = this;

      this.sections = document.querySelectorAll(this.DOM.section);

      if (this.sections.length < 1) {
        return;
      }

      this.sections.forEach(function (section, index) {
        var modelUrl = section.dataset.model;
        var modelName = section.dataset.name;

        if (modelUrl !== "" && modelUrl != null) {
          _this2.initModel(modelUrl, index, resolve, modelName);
        }
      });
    }
    /**
     * model setup and load call
     */

  }, {
    key: "initModel",
    value: function initModel(modelUrl, index, resolve, modelName) {
      var _this3 = this;

      var model = null; // loader

      var dracoLoader = new _DRACOLoader.DRACOLoader();
      dracoLoader.setDecoderPath("https://threejs.org/examples/js/libs/draco/");
      dracoLoader.setDecoderConfig({
        type: "js"
      });
      dracoLoader.load(modelUrl, function (geometry) {
        geometry.computeVertexNormals();
        var material = new THREE.MeshStandardMaterial();
        var mesh = new THREE.Mesh(geometry, material);

        _this3.loadModel(mesh);

        model = mesh;

        _this3.models.push({
          model: model,
          index: index
        });

        mesh.name = modelName;

        _this3.scene.add(mesh);

        dracoLoader.dispose();

        _this3.dirLight.updateMatrix();

        _this3.dirSubLight.updateMatrix();

        _this3.ambientLight.updateMatrix();

        if (index === _this3.sections.length - 1) {
          setTimeout(function () {
            resolve();
          }, 100);
        }
      });
    }
    /**
     * moadel loading and controller call
     * @param [object] object
     */

  }, {
    key: "loadModel",
    value: function loadModel(object) {
      if (object.isMesh) {
        var box = new THREE.Box3().setFromObject(object);
        var z = Math.abs(box.min.z);

        if (z === 0) {
          z = -Math.abs(box.max.z);
        }

        object.geometry.translate(0, 0, z / 2);
        object.rotation.x = Math.PI / 2;
        object.castShadow = true; // object.material.side = 2;
        // object.material.shadowSide = 1;

        object.material.emissive.set(0x020000);
        object.material.metalness = 0; // object.material.opacity = 0.3;

        object.material.depthFunc = false; // object.material.depthWrite = true;

        object.material.transparent = false;
        object.material.color.set(0x000dff);
        object.material.color.convertSRGBToLinear(); // // object.matrixAutoUpdate = false;
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

  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    /**
     * requestAnimationFrame
     */

  }, {
    key: "animate",
    value: function animate() {
      var _this4 = this;

      this.renderer.render(this.scene, this.camera);

      if (this.renderer != null) {
        requestAnimationFrame(function () {
          return _this4.animate();
        });
      }
    }
    /**
     * scrollTrigger
     */

  }, {
    key: "scrollController",
    value: function scrollController() {
      var _this5 = this;

      // sort by index
      this.models.sort(function (a, b) {
        return a.index - b.index;
      });
      this.models.forEach(function (model, index) {
        var direction = _this5.checkDirection(_this5.sections[model.index].dataset.position);

        var nextDirection = 0;

        if (_this5.sections[index + 1] != null) {
          nextDirection = _this5.checkDirection(_this5.sections[index + 1].dataset.position);
        }

        model.direction = direction;

        _this5.changeModelPosition(direction, nextDirection, model);

        _gsap.default.to(model.model.rotation, {
          scrollTrigger: {
            trigger: _this5.sections[model.index],
            start: "top 50%",
            end: "bottom ".concat(model.index === _this5.sections.length - 1 ? "top" : "50%"),
            scrub: true,
            onEnter: function onEnter() {
              _this5.modelShow(model.model);
            },
            onLeave: function onLeave() {
              _this5.modelHide(model.model, model.index !== _this5.models.length - 1);
            },
            onEnterBack: function onEnterBack() {
              _this5.modelShow(model.model);
            },
            onLeaveBack: function onLeaveBack() {
              _this5.modelHide(model.model, model.index !== 0);
            }
          },
          ease: "none"
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

  }, {
    key: "checkDirection",
    value: function checkDirection(direction) {
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

  }, {
    key: "changeModelPosition",
    value: function changeModelPosition(current, next, model) {
      var _this6 = this;

      var rotation = model.index === this.sections.length - 1 ? -2 : -1;

      if (current > next) {
        rotation = model.index === this.sections.length - 1 ? 2 : 1;
      }

      this.models.filter(function (modelSingle) {
        if (modelSingle.index === model.index) {
          modelSingle.endTilt = 0.25 * current;
        }
      });
      this.models.filter(function (modelSingle) {
        if (modelSingle.index === model.index + 1) {
          modelSingle.startTilt = model.endTilt;
        }
      });
      this.models.filter(function (modelSingle) {
        var tl = _gsap.default.timeline({
          // ease: "none",
          scrollTrigger: {
            trigger: _this6.sections[model.index],
            start: "".concat(model.index === 0 ? "top" : "top", " top"),
            end: "bottom top",
            scrub: true
          }
        }).addLabel("start").add("start").fromTo(modelSingle.model.position, {
          x: 150 * current
        }, {
          x: 150 * next,
          ease: "none",
          duration: 2
        }, "start").fromTo(modelSingle.model.position, {
          z: 0
        }, {
          z: 150,
          ease: "none",
          duration: 1
        }, "start").fromTo(modelSingle.model.position, {
          z: 150
        }, {
          z: 0,
          ease: "none",
          duration: 1
        }, "-=1").addLabel("end");

        _gsap.default.fromTo(modelSingle.model.rotation, {
          y: modelSingle.index === 0 ? 0 : model.startTilt || 0,
          z: 0
        }, {
          y: model.endTilt || 0,
          z: Math.PI * 2 * (_this6.scrollTop ? -1 : 1) * rotation,
          ease: "none",
          scrollTrigger: {
            trigger: _this6.sections[model.index],
            start: "".concat(model.index === 0 ? "top" : "top", " top"),
            end: "bottom top",
            scrub: true
          }
        });

        _gsap.default.set(modelSingle.model.position, {
          x: 150 * _this6.models[0].direction
        });
      });
    }
    /**
     *
     * @param model
     * @param hide
     */

  }, {
    key: "modelHide",
    value: function modelHide(model) {
      var hide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (hide === false) {
        return;
      }

      _gsap.default.set(model.material, {
        opacity: 0.7,
        overwrite: true,
        onComplete: function onComplete() {
          model.visible = false;
        }
      });
    }
    /**
     *
     * @param model
     */

  }, {
    key: "modelShow",
    value: function modelShow(model) {
      _gsap.default.to(model.material, {
        opacity: 1,
        duration: 0.3,
        ease: "none",
        overwrite: true,
        onStart: function onStart() {
          model.visible = true;
        }
      });
    }
  }, {
    key: "checkScroll",
    value: function checkScroll() {
      var _this7 = this;

      var currentTop = window.pageYOffset | document.body.scrollTop;
      var pervTop = 0;
      document.addEventListener("scroll", function () {
        currentTop = window.pageYOffset | document.body.scrollTop;
        _this7.scrollTop = pervTop >= currentTop;
      });
    }
  }]);

  return ThreeScrollytelling;
}();

exports.default = ThreeScrollytelling;

},{"./ScrollMarquee":1,"gsap":"gsap","gsap/ScrollTrigger":"gsap/ScrollTrigger","three/examples/jsm/loaders/DRACOLoader":"three/examples/jsm/loaders/DRACOLoader"}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VerticalMouseDrivenCarousel = /*#__PURE__*/function () {
  function VerticalMouseDrivenCarousel() {
    _classCallCheck(this, VerticalMouseDrivenCarousel);

    this.defaults = {
      carousel: ".js-mouse-driven-vertical-carousel",
      bgImg: ".js-mouse-driven-vertical-carousel-bg-img",
      list: ".js-mouse-driven-vertical-carousel-list",
      listItem: ".js-mouse-driven-vertical-carousel-list-item"
    };
    this.posY = 0;

    if (this.getCarousel() == null) {
      return;
    }

    this.initCursor();
    this.init();
    this.bgImgController();
  } //region getters


  _createClass(VerticalMouseDrivenCarousel, [{
    key: "getBgImgs",
    value: function getBgImgs() {
      return document.querySelectorAll(this.defaults.bgImg);
    }
  }, {
    key: "getListItems",
    value: function getListItems() {
      return document.querySelectorAll(this.defaults.listItem);
    }
  }, {
    key: "getList",
    value: function getList() {
      return document.querySelector(this.defaults.list);
    }
  }, {
    key: "getCarousel",
    value: function getCarousel() {
      return document.querySelector(this.defaults.carousel);
    }
  }, {
    key: "init",
    value: function init() {
      _gsap.default.set(this.getBgImgs(), {
        autoAlpha: 0,
        scale: 1.05,
        overwrite: true
      });

      _gsap.default.set(this.getBgImgs()[0], {
        autoAlpha: 1,
        scale: 1,
        overwrite: true
      });

      this.listItems = this.getListItems().length - 1;
      this.listOpacityController(0);
    }
  }, {
    key: "initCursor",
    value: function initCursor() {
      var _this = this;

      var listHeight = this.getList().clientHeight;
      var carouselHeight = this.getCarousel().clientHeight;
      this.getCarousel().addEventListener("mousemove", function (event) {
        _this.posY = event.pageY - _this.getCarousel().offsetTop;
        var offset = -_this.posY / carouselHeight * listHeight;

        _gsap.default.to(_this.getList(), {
          duration: 0.3,
          y: offset,
          ease: "power4.out",
          overwrite: true
        });
      }, false);
    }
  }, {
    key: "bgImgController",
    value: function bgImgController() {
      var _this2 = this;

      var _iterator = _createForOfIteratorHelper(this.getListItems()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var link = _step.value;
          link.addEventListener("mouseenter", function (ev) {
            var currentId = ev.currentTarget.dataset.itemId;

            _this2.listOpacityController(currentId);

            _gsap.default.to(ev.currentTarget, {
              duration: 0.3,
              autoAlpha: 1,
              overwrite: true
            });

            _gsap.default.to(".is-visible", {
              duration: 0.2,
              autoAlpha: 0,
              scale: 1.05,
              overwrite: true
            });

            if (!_this2.getBgImgs()[currentId].classList.contains("is-visible")) {
              _this2.getBgImgs()[currentId].classList.add("is-visible");
            }

            _gsap.default.to(_this2.getBgImgs()[currentId], {
              duration: 0.6,
              autoAlpha: 1,
              scale: 1,
              overwrite: true
            });
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "listOpacityController",
    value: function listOpacityController(id) {
      id = parseInt(id);
      var aboveCurrent = this.listItems - id;
      var belowCurrent = parseInt(id);

      if (aboveCurrent > 0) {
        for (var i = 1; i <= aboveCurrent; i++) {
          var opacity = 0.5 / i;
          var offset = 2 * i;

          _gsap.default.to(this.getListItems()[id + i], {
            duration: 0.5,
            autoAlpha: opacity,
            x: "".concat(offset, "vw"),
            ease: "power3.out",
            overwrite: true
          });
        }
      }

      if (belowCurrent > 0) {
        for (var _i = 0; _i <= belowCurrent; _i++) {
          var _opacity = 0.5 / _i;

          var _offset = 2 * _i;

          _gsap.default.to(this.getListItems()[id - _i], {
            duration: 0.5,
            autoAlpha: _opacity,
            x: "".concat(_offset, "vw"),
            ease: "power3.out",
            overwrite: true
          });
        }
      }
    }
  }]);

  return VerticalMouseDrivenCarousel;
}();

exports.default = VerticalMouseDrivenCarousel;

},{"gsap":"gsap"}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _ScrollTrigger = _interopRequireDefault(require("gsap/ScrollTrigger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap.default.registerPlugin(_ScrollTrigger.default);

var ScrollingMarquee = /*#__PURE__*/function () {
  function ScrollingMarquee() {
    _classCallCheck(this, ScrollingMarquee);

    this.dividers = document.querySelectorAll(".js-scrolling-marquee-divider");
    this.lines = document.querySelectorAll(".js-scrolling-marquee-line");

    if (this.dividers.length < 1 || this.lines.length < 1) {
      return;
    }

    this.topAnimOffset = this.lines[0].offsetHeight;
    this.winWidth = window.innerWidth;
    this.randomDividerPosition();
    this.linesTrigger();
  }

  _createClass(ScrollingMarquee, [{
    key: "randomDividerPosition",
    value: function randomDividerPosition() {
      var _this = this;

      this.dividers.forEach(function (divider, index) {
        var random = Math.random();

        if (random > 0.8) {
          random = 0.7;
        } else if (random < 0.1) {
          random = 0.3;
        }

        divider.style.left = "".concat(_this.winWidth * random, "px");

        _this.dividerController(divider, index);
      });
    }
  }, {
    key: "linesTrigger",
    value: function linesTrigger() {
      var _this2 = this;

      this.lines.forEach(function (line) {
        _this2.lineController(line);
      });
    }
  }, {
    key: "lineController",
    value: function lineController(line) {
      _gsap.default.to(line, {
        scrollTrigger: {
          trigger: line,
          start: "top bottom",
          end: "bottom+=".concat(this.topAnimOffset * 2, " top"),
          scrub: true
        },
        x: "-100%",
        ease: "power3.inOut"
      });
    }
  }, {
    key: "dividerController",
    value: function dividerController(divider, index) {
      var random = Math.random();
      var offset = random * 200;

      if (index % 2 === 0) {
        offset = -offset;
      }

      _gsap.default.to(divider, {
        scrollTrigger: {
          trigger: divider,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        x: "".concat(offset, "%"),
        scaleX: 1 + random
      });
    }
  }]);

  return ScrollingMarquee;
}();

exports.default = ScrollingMarquee;

},{"gsap":"gsap","gsap/ScrollTrigger":"gsap/ScrollTrigger"}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Template component
 * explain what this class is doing
 */
var TemplateComponent = /*#__PURE__*/function () {
  function TemplateComponent() {
    _classCallCheck(this, TemplateComponent);

    /**
     * Template component DOM selectors
     * @type {{templateComponentArray: string, templateComponent: string, states: {isActive: string}}}
     */
    this.DOM = {
      templateComponent: ".js-template-component",
      templateComponentArray: ".js-template-component-array",
      states: {
        isActive: "is-active"
      }
    };
    /**
     * Fetch template component DOM element
     * @type {Element}
     */

    this.templateComponent = document.querySelector(this.DOM.templateComponent);
    /**
     * Fetch template component list of DOM elements
     * @type {NodeListOf<Element>}
     */

    this.templateComponentArray = document.querySelectorAll(this.DOM.templateComponentArray);
  }
  /**
   * Init
   */


  _createClass(TemplateComponent, [{
    key: "init",
    value: function init() {
      if (this.templateComponent === null) {
        return;
      } // if (this.templateComponentArray.length < 1) {
      //     return;
      // }


      console.log("Template component init");
      this.templateMethod();
    }
    /**
     * Template method
     * explain what this method is doing
     */

  }, {
    key: "templateMethod",
    value: function templateMethod() {
      console.log("Template method init");
    }
  }]);

  return TemplateComponent;
}();

exports.default = TemplateComponent;

},{}],6:[function(require,module,exports){
"use strict";

var _TemplateComponent = _interopRequireDefault(require("./examples/TemplateExample/TemplateComponent"));

var _MouseDrivenVerticalCarousel = _interopRequireDefault(require("./examples/MouseDrivenVerticalCarousel/MouseDrivenVerticalCarousel"));

var _ScrollingMarquee = _interopRequireDefault(require("./examples/ScrollingMarquee/ScrollingMarquee"));

var _ThreeScrollytelling = _interopRequireDefault(require("./examples/3dScrollytelling/ThreeScrollytelling"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MAIN JS FILE
 */

/**
 * Helpers
 * Imports of helper functions are stripped out of bundle
 * Include them within "start-strip-code" and "end-strip-code" comments
 */

/**
 * Components
 */

/**
 * Check if document is ready cross-browser
 * @param callback
 */
var ready = function ready(callback) {
  if (document.readyState !== "loading") {
    /**
     * Document is already ready, call the callback directly
     */
    callback();
  } else if (document.addEventListener) {
    /**
     * All modern browsers to register DOMContentLoaded
     */
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    /**
     * Old IE browsers
     */
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState === "complete") {
        callback();
      }
    });
  }
};
/**
 * Document ready callback
 */


ready(function () {
  /**
   * HELPERS INIT
   * Only init helpers if they exist
   * Will be undefined on production because of import stripping
   */

  /**
   * CREDITS INIT
   */
  var credits = ["background-color: #000000", "color: white", "display: block", "line-height: 24px", "text-align: center", "border: 1px solid #ffffff", "font-weight: bold"].join(";");
  console.info("dev by: %c Bornfight FE Team ", credits);
  /**
   * COMPONENTS INIT
   */

  /**
   * Template component
   * @type {TemplateComponent}
   */

  var templateComponent = new _TemplateComponent.default();
  templateComponent.init();
  /**
   * VerticalMouseDrivenCarousel component
   * @type {VerticalMouseDrivenCarousel}
   */

  var verticalMouseDrivenCarousel = new _MouseDrivenVerticalCarousel.default();
  /**
   * ScrollingMarquee component
   * @type {ScrollingMarquee}
   */

  var scrollingMarquee = new _ScrollingMarquee.default();
  /**
   * threeScrollytelling component
   * @type {threeScrollytelling}
   */

  var threeScrollytelling = new _ThreeScrollytelling.default();
  threeScrollytelling.init();
});

},{"./examples/3dScrollytelling/ThreeScrollytelling":2,"./examples/MouseDrivenVerticalCarousel/MouseDrivenVerticalCarousel":3,"./examples/ScrollingMarquee/ScrollingMarquee":4,"./examples/TemplateExample/TemplateComponent":5}]},{},[6])

//# sourceMappingURL=bundle.js.map

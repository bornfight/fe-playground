(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        scale: 1.05
      });

      _gsap.default.set(this.getBgImgs()[0], {
        autoAlpha: 1,
        scale: 1
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
          ease: "power4.out"
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
              autoAlpha: 1
            });

            _gsap.default.to(".is-visible", {
              duration: 0.2,
              autoAlpha: 0,
              scale: 1.05
            });

            if (!_this2.getBgImgs()[currentId].classList.contains("is-visible")) {
              _this2.getBgImgs()[currentId].classList.add("is-visible");
            }

            _gsap.default.to(_this2.getBgImgs()[currentId], {
              duration: 0.6,
              autoAlpha: 1,
              scale: 1
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
          var offset = 5 * i;

          _gsap.default.to(this.getListItems()[id + i], {
            duration: 0.5,
            autoAlpha: opacity,
            x: offset,
            ease: "power3.out"
          });
        }
      }

      if (belowCurrent > 0) {
        for (var _i = 0; _i <= belowCurrent; _i++) {
          var _opacity = 0.5 / _i;

          var _offset = 5 * _i;

          _gsap.default.to(this.getListItems()[id - _i], {
            duration: 0.5,
            autoAlpha: _opacity,
            x: _offset,
            ease: "power3.out"
          });
        }
      }
    }
  }]);

  return VerticalMouseDrivenCarousel;
}();

exports.default = VerticalMouseDrivenCarousel;

},{"gsap":"gsap"}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

var _TemplateComponent = _interopRequireDefault(require("./examples/TemplateExample/TemplateComponent"));

var _MouseDrivenVerticalCarousel = _interopRequireDefault(require("./examples/MouseDrivenVerticalCarousel/MouseDrivenVerticalCarousel"));

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
  verticalMouseDrivenCarousel.init();
});

},{"./examples/MouseDrivenVerticalCarousel/MouseDrivenVerticalCarousel":1,"./examples/TemplateExample/TemplateComponent":2}]},{},[3])

//# sourceMappingURL=bundle.js.map

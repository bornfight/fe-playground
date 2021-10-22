(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

var _TemplateComponent = _interopRequireDefault(require("./examples/TemplateExample/TemplateComponent"));

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
});

},{"./examples/TemplateExample/TemplateComponent":1}]},{},[2])

//# sourceMappingURL=bundle.js.map

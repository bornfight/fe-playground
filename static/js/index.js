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
import TemplateComponent from "./examples/TemplateExample/TemplateComponent";
import VerticalMouseDrivenCarousel from "./examples/MouseDrivenVerticalCarousel/MouseDrivenVerticalCarousel";
import ScrollingMarquee from "./examples/ScrollingMarquee/ScrollingMarquee";

/**
 * Check if document is ready cross-browser
 * @param callback
 */
const ready = (callback) => {
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
ready(() => {
    /**
     * HELPERS INIT
     * Only init helpers if they exist
     * Will be undefined on production because of import stripping
     */

    /**
     * CREDITS INIT
     */
    const credits = [
        "background-color: #000000",
        "color: white",
        "display: block",
        "line-height: 24px",
        "text-align: center",
        "border: 1px solid #ffffff",
        "font-weight: bold",
    ].join(";");
    console.info("dev by: %c Bornfight FE Team ", credits);

    /**
     * COMPONENTS INIT
     */

    /**
     * Template component
     * @type {TemplateComponent}
     */
    const templateComponent = new TemplateComponent();
    templateComponent.init();

    /**
     * VerticalMouseDrivenCarousel component
     * @type {VerticalMouseDrivenCarousel}
     */
    const verticalMouseDrivenCarousel = new VerticalMouseDrivenCarousel();

    /**
     * ScrollingMarquee component
     * @type {ScrollingMarquee}
     */
    const scrollingMarquee = new ScrollingMarquee();
});

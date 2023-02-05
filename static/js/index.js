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
import ThreeScrollytelling from "./examples/3dScrollytelling/ThreeScrollytelling";
import PanningGallery from "./examples/PanningGallery/PanningGallery";
import HoverClippingNavigation from "./examples/HoverClippingNavigation/HoverClippingNavigation";
import ImageSequence from "./examples/ImageSequence/ImageSequence";
import ContentAnimation from "./examples/ImageSequence/ContentAnimation";
import AnimatedGradient from "./examples/AnimatedGradient/AnimatedGradient";
import BrushTextScroll from "./examples/BrushTextScroll/BrushTextScroll";
import MagneticHotspots from "./examples/MagneticHotspots/MagneticHotspots";
import PetPakAwwwards from "./examples/PetPakAwwwards";
import AimeConcept from "./examples/AimeConcept/AimeConcept";
import WeightViewer from "./examples/WeightViewer/WeightViewer";
import TypeSetter from "./examples/TypeSetter/TypeSetter";
import ThreeSpiralGallery from "./examples/3dSpiralGallery/ThreeSpiralGallery";
import RotationalScroll from "./examples/RotationalScroll/RotationalScroll";

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

    /**
     * threeScrollytelling component
     * @type {threeScrollytelling}
     */
    const threeScrollytelling = new ThreeScrollytelling();
    threeScrollytelling.init();

    /**
     * PanningGallery component
     * @type {PanningGallery}
     */
    const panningGallery = new PanningGallery();
    panningGallery.init();

    /**
     * HoverClippingNavigation component
     * @type {HoverClippingNavigation}
     */
    const hoverClippingNavigation = new HoverClippingNavigation();
    hoverClippingNavigation.init();

    /**
     * ContentAnimation component
     * @type {ContentAnimation}
     */
    const waitForScrollContentAnimations = new Promise((resolve, reject) => {
        const contentAnimation = new ContentAnimation(resolve);
        contentAnimation.init();
    });

    /**
     * ImageSequence component
     * @type {ImageSequence}
     */
    waitForScrollContentAnimations.then(() => {
        const imageSequence = new ImageSequence();
        imageSequence.init();
    });

    /**
     * AnimatedGradient component
     * @type {AnimatedGradient}
     */
    const animatedGradient = new AnimatedGradient();

    /**
     * BrushTextScroll component
     * @type {BrushTextScroll}
     */
    const brushTextScroll = new BrushTextScroll();
    brushTextScroll.init();

    /**
     * MagneticHotspots component
     * @type {MagneticHotspots}
     */
    const magneticHotspots = new MagneticHotspots();

    /**
     * PetPakAwwwards component
     * @type {PetPakAwwwards}
     */
    const petPakAwwwards = new PetPakAwwwards();
    petPakAwwwards.init();

    /**
     * Aime Concept
     * @type {AimeConcept}
     */
    const aimeConcept = new AimeConcept();
    aimeConcept.init();

    /**
     * WeightViewer
     * @type {WeightViewer}
     */
    const weightViewer = new WeightViewer();
    weightViewer.init();

    /**
     * TypeSetter
     * @type {TypeSetter}
     */
    const typeSetter = new TypeSetter();
    typeSetter.init();

    /**
     * ThreeSpiralGallery
     * @type {ThreeSpiralGallery}
     */
    const threeSpiralGallery = new ThreeSpiralGallery();

    /**
     * RotationalScroll
     * @type {RotationalScroll}
     */
    const rotationalScroll = new RotationalScroll();
    rotationalScroll.init();
});

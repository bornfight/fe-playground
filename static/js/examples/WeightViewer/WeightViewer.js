export default class WeightViewer {
    constructor() {
        this.DOM = {
            wrapper: ".js-weight-viewer",
            areasWrapper: ".js-weight-viewer-areas-wrapper",
            active: ".js-weight-viewer-current-active",
        };

        // get hover preview component
        this.hoverPreview = document.querySelector(this.DOM.wrapper);
    }

    init() {
        // return if no component exist
        if (this.hoverPreview == null || window.fontData.length === 0) {
            return;
        }

        this.areasWrapper = document.querySelector(this.DOM.areasWrapper);
        this.currentHoveredType = document.querySelector(this.DOM.active);

        const promise = new Promise((resolve, reject) => {
            this.createAreas(resolve);
        });

        promise.then(() => {
            this.addEventsToAreas();
        });
    }

    createAreas(resolve) {
        const newStyle = document.createElement("style");
        let style = "";
        for (let i = 0; i < window.fontData.length; i++) {
            const fontName = window.fontData[i].fontName.split("-");
            const area = document.createElement("div");
            area.innerText = "A a";
            area.classList.add("js-weight-viewer-area", "c-weight-viewer__single-area");
            area.dataset.fontUrl = window.fontData[i].fileUrl;
            area.dataset.fontName = window.fontData[i].fontName;
            area.dataset.fontDisplyName = fontName[fontName.length - 1];
            this.areasWrapper.appendChild(area);

            area.style.fontFamily = window.fontData[i].fontName;

            style += `@font-face {font-family: "${window.fontData[i].fontName}";src: url('${window.fontData[i].fileUrl}') format('woff');}`;
        }

        newStyle.appendChild(document.createTextNode(style));
        document.head.appendChild(newStyle);

        setTimeout(() => {
            resolve();
        }, 300);
    }

    addEventsToAreas() {
        const areas = document.querySelectorAll(".js-weight-viewer-area");

        for (let i = 0; i < areas.length; i++) {
            areas[i].addEventListener("mouseenter", (ev) => {
                this.hoverPreview.style.fontFamily = ev.currentTarget.dataset.fontName;
                this.currentHoveredType.innerHTML = ev.currentTarget.dataset.fontDisplyName;
            });
        }
    }
}

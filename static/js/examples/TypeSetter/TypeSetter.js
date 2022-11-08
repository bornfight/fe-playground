import ColorSwitch from "./ColorSwitch";

export default class TypeSetter {
    constructor() {
        this.DOM = {
            wrapper: ".js-type-setter",
        };

        this.typetester = document.querySelectorAll(this.DOM.wrapper);
    }

    init() {
        // return if typtester dont exist
        if (this.typetester.length < 1) return;

        this.addFonts();

        this.colorSwitcher = new ColorSwitch();

        const contextWidth = 1440;

        Array.from(this.typetester).forEach((element) => {
            this.colorSwitcher.init(element);
            // get typtester elements
            let preview = element.querySelector(".js-preview");
            let fontWeight = element.querySelector(".js-type-setter-font-weight");
            let fontSize = element.querySelector(".js-font-size");
            let fontSizeValue = fontSize.parentNode.querySelector(".js-input-value");
            let lineHeight = element.querySelector(".js-line-height");
            let lineHeightValue = lineHeight.parentNode.querySelector(".js-input-value");
            let letterSpacing = element.querySelector(".js-letter-spacing");
            let letterSpacingValue = letterSpacing.parentNode.querySelector(".js-input-value");
            let alignLeft = element.querySelector(".js-align-left");
            let alignCenter = element.querySelector(".js-align-center");
            let alignRight = element.querySelector(".js-align-right");
            let alignJustify = element.querySelector(".js-align-justify");

            // apply defaults for typetester modul
            preview.style.fontFamily = fontWeight[fontWeight.selectedIndex].dataset.fontName;
            preview.style.fontSize = (fontSize.value / contextWidth) * 100 + "vw";
            preview.style.lineHeight = lineHeight.value;
            preview.style.letterSpacing = letterSpacing.value + "px";

            // catch paste events and paste them without formatting
            preview.addEventListener("paste", (e) => {
                e.preventDefault();
                let text = (e.originalEvent || e).clipboardData.getData("text/plain");
                document.execCommand("insertHTML", false, text);
            });

            // catch change on font weight dropdown and apply styles
            fontWeight.addEventListener("change", () => {
                preview.style.fontFamily = fontWeight[fontWeight.selectedIndex].dataset.fontName;
            });

            // catch change on font size slider and apply styles
            fontSize.addEventListener("input", () => {
                preview.style.fontSize = (fontSize.value / contextWidth) * 100 + "vw";
                fontSizeValue.value = fontSize.value;
            });

            fontSizeValue.addEventListener("input", () => {
                if (parseInt(fontSizeValue.value) > parseInt(fontSize.max)) {
                    fontSizeValue.value = fontSize.max;
                }

                if (parseInt(fontSizeValue.value) < parseInt(fontSize.min)) {
                    fontSizeValue.value = fontSize.min;
                }

                preview.style.fontSize = (fontSizeValue.value / contextWidth) * 100 + "vw";
                fontSize.value = fontSizeValue.value;
            });

            // catch change on line height slider and apply styles
            lineHeight.addEventListener("input", () => {
                preview.style.lineHeight = lineHeight.value;
                lineHeightValue.value = lineHeight.value;
            });

            lineHeightValue.addEventListener("input", () => {
                if (parseInt(lineHeightValue.value) > parseInt(lineHeight.max)) {
                    lineHeightValue.value = lineHeight.max;
                }

                if (parseInt(lineHeightValue.value) < parseInt(lineHeight.min)) {
                    lineHeightValue.value = lineHeight.min;
                }

                preview.style.lineHeight = lineHeightValue.value;
                lineHeight.value = lineHeightValue.value;
            });

            // catch change on letter spacing slider and apply styles
            letterSpacing.addEventListener("input", () => {
                preview.style.letterSpacing = letterSpacing.value + "px";
                letterSpacingValue.value = letterSpacing.value;
            });

            letterSpacingValue.addEventListener("input", () => {
                if (parseInt(letterSpacingValue.value) > parseInt(letterSpacing.max)) {
                    letterSpacingValue.value = lineHeight.max;
                }

                if (parseInt(letterSpacingValue.value) < parseInt(letterSpacing.min)) {
                    letterSpacingValue.value = letterSpacing.min;
                }

                preview.style.letterSpacing = letterSpacingValue.value + "px";
                letterSpacing.value = letterSpacingValue.value;
            });

            // catch click on align left icon and apply style
            alignLeft.addEventListener("click", () => {
                preview.style.textAlign = "left";
                removeAlignActiveClasses();
                alignLeft.classList.add("is-active");
            });

            // catch click on align center icon and apply style
            alignCenter.addEventListener("click", () => {
                preview.style.textAlign = "center";
                removeAlignActiveClasses();
                alignCenter.classList.add("is-active");
            });

            // catch click on align right icon and apply style
            alignRight.addEventListener("click", () => {
                preview.style.textAlign = "right";
                removeAlignActiveClasses();
                alignRight.classList.add("is-active");
            });

            // catch click on align justify icon and apply style
            alignJustify.addEventListener("click", () => {
                preview.style.textAlign = "justify";
                removeAlignActiveClasses();
                alignJustify.classList.add("is-active");
            });

            function removeAlignActiveClasses() {
                alignJustify.classList.remove("is-active");
                alignRight.classList.remove("is-active");
                alignCenter.classList.remove("is-active");
                alignLeft.classList.remove("is-active");
            }
        });
    }

    addFonts() {
        if (!window.fontData) return;

        const newStyle = document.createElement("style");
        let style = "";
        for (let i = 0; i < window.fontData.length; i++) {
            style += `@font-face {font-family: "${window.fontData[i].fontName}";src: url('${window.fontData[i].fileUrl}') format('woff');}`;
        }

        newStyle.appendChild(document.createTextNode(style));
        document.head.appendChild(newStyle);
    }
}

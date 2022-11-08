export default class ColorSwitch {
    constructor() {}

    init(wrapper) {
        this.switchRed = wrapper.querySelector(".js-switch-red");
        this.switchWhite = wrapper.querySelector(".js-switch-white");
        this.switchBlack = wrapper.querySelector(".js-switch-black");
        this.switchYellow = wrapper.querySelector(".js-switch-yellow");

        if (!this.switchRed || !this.switchWhite || !this.switchBlack || !this.switchYellow) {
            return;
        }

        this.switchRed.addEventListener("click", () => {
            wrapper.classList.remove("is-white-color");
            wrapper.classList.remove("is-black-color");
            wrapper.classList.remove("is-yellow-color");
            wrapper.classList.add("is-red-color");
        });

        this.switchYellow.addEventListener("click", () => {
            wrapper.classList.remove("is-white-color");
            wrapper.classList.remove("is-black-color");
            wrapper.classList.remove("is-red-color");
            wrapper.classList.add("is-yellow-color");
        });

        this.switchWhite.addEventListener("click", () => {
            wrapper.classList.remove("is-red-color");
            wrapper.classList.remove("is-black-color");
            wrapper.classList.remove("is-yellow-color");
            wrapper.classList.add("is-white-color");
        });

        this.switchBlack.addEventListener("click", () => {
            wrapper.classList.remove("is-red-color");
            wrapper.classList.remove("is-white-color");
            wrapper.classList.remove("is-yellow-color");
            wrapper.classList.add("is-black-color");
        });
    }
}

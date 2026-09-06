import { getUnlocalizedBasePath } from "./i18n.js";

customElements.define('hakken-image', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <img src="${getUnlocalizedBasePath() + this.getAttribute("src")}" style="width:100%; height: 100%;">
        </img>
        `;
    }
});
import { getUnlocalizedBasePath } from "./i18n.js";

customElements.define('hakken-platform-portal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <hakken-portal href="${this.getAttribute("href")}" style="display:flex;flex-direction:row;justify-items: center;margin-bottom: 4px;">
            <div style="display:flex;flex-direction:row;justify-items: center;gap:10px;">
                <img src="${getUnlocalizedBasePath() + this.getAttribute("icon")}" style="display:inline-block;width:24px;border-radius:4px; user-select:none;"></img>
                ${this.innerHTML}
            </div>
        </hakken-portal>
        `;
    }
});
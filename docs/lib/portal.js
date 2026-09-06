customElements.define('hakken-portal', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <a href="${this.getAttribute("href")}" target="_blank" rel="noopener noreferrer">
        ${this.innerHTML}
        </a>
        `;
    }
});
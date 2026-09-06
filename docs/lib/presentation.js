customElements.define('hakken-presentation', class extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute("title");
        const src = this.getAttribute("src");
        this.innerHTML = `
        <h1>${title}</h1>
        <iframe
            title="${title}"
            src="${src}"
            frameborder="0"
            width="960"
            height="569"
            allowfullscreen="true">
        </iframe>
        ${this.innerHTML}
        `;
    }
});
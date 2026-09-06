import { getLocale, getUnlocalizedBasePath } from "../lib/i18n.js";
import '../lib/presentation.js';
import '../lib/portal.js';
import '../lib/platform-portal.js'
import '../lib/image.js'
import { disableScroll, enableScroll, scrollToTopOfPage } from "../lib/scroll.js";

customElements.define('hakken-page', class extends HTMLElement {
    static observedAttributes = ["source"];
    busy = false;
    // Used to indicate if the source has changed during a reload().
    nextSource = "";
    nextLocale = "";
    loadedSource = "";
    loadedLocale = "";

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${import.meta.resolve('./styles.css')}">
            <div class="page">
                <div class="content"><slot></slot></div>
            </div>
        `;
    }
    async connectedCallback() {
        await this.reload();
    }
    
    async attributeChangedCallback(name, oldValue, newValue) {
        await this.reload();
    }

    async reload() {
        if (this.busy) {
            this.nextSource = this.getAttribute("source");
            this.nextLocale = getLocale();
            // Ideally we would want to reject the Promise.all below remotely from here
            // so the updated fetch can be launched right away.
            // But canceling Promises is such a pain that I've decided to just not deal with it.
            return;
        }
        const page = this.shadowRoot.querySelector('.page');
        const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop
        const transitionDuration = Math.min(Math.max(0.25, scrollPosition / 200.0), 1.0);
        const transitionDurationString = `${transitionDuration}s`;
        page.style.setProperty("--transition-duration", transitionDurationString);
        const content = this.shadowRoot.querySelector('.content');
        if (page.hasAttribute("loaded")) {
            page.removeAttribute("loaded");
        }
        this.busy = true;
        scrollToTopOfPage();
        disableScroll();
        let source = this.getAttribute("source");
        this.nextSource = source;
        let locale = getLocale();
        this.nextLocale = locale;
        while (true) {
            let timeout = transitionDuration * 1000 + 50;
            if (source) {
                const [text, _] = await Promise.all([(async () => {
                    const html = await fetch(`${getUnlocalizedBasePath()}/content/${source}/${locale}.html`);
                    return await html.text()
                })(), new Promise(res => setTimeout(res, timeout))]);
                if (this.nextSource != source || this.nextLocale != locale) {
                    source = this.nextSource;
                    locale = this.nextLocale;
                    if (this.loadedSource != source || this.loadedLocale != locale) {
                        // Skip timeout next time.
                        timeout = 0;
                        continue;
                    }
                }

                if (this.loadedSource != source || this.loadedLocale != locale) {
                    content.replaceChildren([]);
                    content.insertAdjacentHTML('beforeend', text);
                    page.style.setProperty("--transition-duration",`${page.clientHeight / 200}s`);
                }
                page.setAttribute("loaded", "");
                this.loadedSource = source;
                this.loadedLocale = locale;
            } else {
                content.replaceChildren([]);
            }
            break;
        }
        enableScroll();
        this.busy = false;
    }
});
// Route sources
import './Page.js'
import { matchesRoute, pushState, routerEvents } from '../lib/view-route.js';
import { getLocaleIndex, getLocalizedLocationPath, getUnlocalizedBasePath, getUnlocalizedLocationPath, LOC_META_INDEX_IDENTIFIER, LOC_META_INDEX_NAME, LOC_META_INDEX_TL_LANGUAGE, localizeLocation, locMeta } from '../lib/i18n.js';

const TAB_INDEX_TITLE = 0;
const TAB_INDEX_HREF = 1;
const TAB_INDEX_ROUTE = 2;
const TAB_INDEX_IS_EXACT = 3;
const TAB_INDEX_SOURCE = 4;
const tabs = [
    [
        "Home", // title
        "", // href
        "/(?:index.html)?", // route
        true, // is_exact
        "home", // source
    ],
    [
        "Works",
        "works",
        "/works",
        false,
        "works",
    ],
    [
        "Talks",
        "talks",
        "/talks",
        false,
        "talks",
    ],
    [
        "Contact",
        "contact",
        "/contact",
        false,
        "contact",
    ],
];

customElements.define('hakken-lang-selector', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <button class="dropdown-trigger">
            <img src="${getUnlocalizedBasePath()}/content/root/language.svg"></img>
            <span id="hakken-lang-title"></span>
            <span class="arrow">▲</span>
        </button>
        <ul class="dropdown-menu accordion">
            ${locMeta.map((tuple, index) => `<li>
                <input type="radio" id="hakken-lang-option-${index}" name="lang-selection"></input>
                <label for="hakken-lang-option-${index}">${tuple[LOC_META_INDEX_NAME]}</label>
                </li>`)
                .join("")}
        </ul>
        `;
        this.querySelectorAll(`li input`).forEach((value, key, parent) => {
            value.onclick = () => {
                const localeIndex = getLocaleIndex();
                if (localeIndex) {
                    const option = document.getElementById(`hakken-lang-option-${localeIndex}`);
                    if (option.checked) {
                        return;
                    }
                }
                pushState('nav-forward', null, localizeLocation(locMeta[key][LOC_META_INDEX_IDENTIFIER]));
            };
        });
        routerEvents.addEventListener('popstate', data => {
            this.reload();
        });
        this.reload();
    }
    reload() {
        const title = this.querySelector("#hakken-lang-title");
        if (title) {
            title.innerHTML = locMeta[getLocaleIndex()][LOC_META_INDEX_TL_LANGUAGE];
        }
        const localeIndex = getLocaleIndex();
        if (localeIndex >= 0) {
            const option = document.getElementById(`hakken-lang-option-${localeIndex}`);
            if (option) {
                option.checked = true;
            }
        }
    }
});

customElements.define('hakken-navbar', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="folder-nav">
            ${
                tabs.map(
                    (tuple, index) => `<input type="radio" id="hakken-nav-${index}" name="nav"></input>
                    <label class="folder-tab" for="hakken-nav-${index}">${tuple[TAB_INDEX_TITLE]}</label>`)
                .join("")
            }
        </nav>
        `;
        this.querySelectorAll(`input`).forEach((value, key, parent) => {
            value.onclick = () => {
                const tabIndex = tabs.findIndex(tuple => matchesRoute(tuple[TAB_INDEX_ROUTE], tuple[TAB_INDEX_IS_EXACT]));
                if (tabIndex >= 0) {
                    const navtab = document.getElementById(`hakken-nav-${tabIndex}`);
                    if (navtab) {
                        if (navtab.checked) {
                            return;
                        }
                    }
                }
                pushState('nav-forward', null, getLocalizedLocationPath() + "/" + tabs[key][TAB_INDEX_HREF]);
            };
        });
        routerEvents.addEventListener('popstate', data => {
            this.syncNavbar();
        });
        this.syncNavbar();
    }

    syncNavbar() {
        const tabIndex = tabs.findIndex(tuple => matchesRoute(tuple[TAB_INDEX_ROUTE], tuple[TAB_INDEX_IS_EXACT]));
        if (tabIndex >= 0) {
            const navtab = document.getElementById(`hakken-nav-${tabIndex}`);
            if (navtab) {
                navtab.checked = true;
            }
        }
    }
});

customElements.define('hakken-app', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <img class="logo-container pixel-art" rel="preload" src="${getUnlocalizedBasePath()}/content/root/hakken-lab-logo.png"></img>
        <hakken-lang-selector></hakken-lang-selector>
        <hakken-navbar></hakken-navbar>
        <div class="window-body">
            <hakken-page>
            </hakken-page>
        </div>
        `;
        const page = this.querySelector("hakken-page");
        const tabIndex = tabs.findIndex(tuple => matchesRoute(tuple[TAB_INDEX_ROUTE], tuple[TAB_INDEX_IS_EXACT]));
        if (tabIndex >= 0) {
            page.setAttribute("source", tabs[tabIndex][TAB_INDEX_SOURCE]);
        } else {
            page.setAttribute("source", "404");
        }
        routerEvents.addEventListener('popstate', data => {
            const tabIndex = tabs.findIndex(tuple => matchesRoute(tuple[TAB_INDEX_ROUTE], tuple[TAB_INDEX_IS_EXACT]));
            if (tabIndex >= 0) {
                page.setAttribute("source", tabs[tabIndex][TAB_INDEX_SOURCE]);
            } else {
                page.setAttribute("source", "404");
            }
        });
        routerEvents.addEventListener('navigate', (e) => {
            e.stopImmediatePropagation();
            const { url, a } = e.detail;
            const isBackNav = a?.classList?.contains('back');
            const transitionType = isBackNav ? 'nav-back' : 'nav-forward';
            const tabIndex = tabs.findIndex(tuple => matchesRoute(tuple[TAB_INDEX_ROUTE], tuple[TAB_INDEX_IS_EXACT]));
            if (tabIndex >= 0) {
                page.setAttribute("source", tabs[tabIndex][TAB_INDEX_SOURCE]);
            } else {
                page.setAttribute("source", "404");
            }
            pushState(transitionType, null, url);
        }, { capture: true });
        
        
    }
});

export function getLocale() {
    return locMeta[getLocaleIndex()][LOC_META_INDEX_IDENTIFIER];
}

const baseURL = new URL(window.originalHref || document.URL);
const basePath = (baseURL.host ? baseURL.origin : baseURL.pathname.slice(0, baseURL.pathname.lastIndexOf('/')));

export function getCurrentLocaleIdentifierSlug() {
    const slugPath = window.location.href.replace(window.origin, "")
    .replace(basePath, "");
    let firstSlugIndex = slugPath.indexOf("/");
    if (firstSlugIndex < 0) {
        firstSlugIndex = 0;
    }
    let nextSlugIndex = slugPath.indexOf("/", firstSlugIndex + 1);
    if (nextSlugIndex < 0) {
        nextSlugIndex = slugPath.length;
    }
    
    const langSlug = slugPath.slice(firstSlugIndex + 1, nextSlugIndex);
    let index = locMeta.findIndex(tuple => tuple[LOC_META_INDEX_IDENTIFIER] == langSlug);
    if (index >= 0) {
        return langSlug;
    }
    return "";
}

export function getLocaleIndex() {
    const langSlug = getCurrentLocaleIdentifierSlug();

    let index = locMeta.findIndex(tuple => tuple[LOC_META_INDEX_IDENTIFIER] == langSlug);
    if (index >= 0) {
        return index;
    }
    // Use browser-preferred language. Strip region code just in case.
    index = locMeta.findIndex(tuple => tuple[LOC_META_INDEX_LANGUAGE_CODE] == navigator.language.split("-")[0]);
    if (index >= 0) {
        return index;
    }
    return 0; // Default: English
}

export function getUnlocalizedBasePath() {
    return basePath;
}

export function getUnlocalizedLocationPath() {
    const slugPath = window.location.href.replace(window.origin, "")
    .replace(basePath, "");
    let firstSlugIndex = slugPath.indexOf("/");
    if (firstSlugIndex < 0) {
        firstSlugIndex = 0;
    }
    let nextSlugIndex = slugPath.indexOf("/", firstSlugIndex + 1);
    if (nextSlugIndex < 0) {
        nextSlugIndex = slugPath.length;
    }
    const langSlug = slugPath.slice(firstSlugIndex + 1, nextSlugIndex);
    let index = locMeta.findIndex(tuple => tuple[LOC_META_INDEX_IDENTIFIER] == langSlug);
    if (index >= 0) {
        if (nextSlugIndex < slugPath.length) {
            return basePath + slugPath.slice(nextSlugIndex);
        } else {
            return basePath + "/" + slugPath.slice(nextSlugIndex);
        }
    }
    return basePath + (slugPath.startsWith("/") ? slugPath : ("/" + slugPath));
}

export function getLocalizedLocationPath() {
    let path = getUnlocalizedBasePath();
    let slug = getCurrentLocaleIdentifierSlug();
    if (path.endsWith("/")) {
        path = path.slice(0, path.length - 1);
    }
    if (slug && !slug.startsWith("/")) {
        slug = "/" + slug;
    }
    return path + slug;
}

export function getUnlocalizedSlug() {
    const slugPath = window.location.href.replace(window.origin, "")
    .replace(basePath, "");
    let firstSlugIndex = slugPath.indexOf("/");
    if (firstSlugIndex < 0) {
        firstSlugIndex = 0;
    }
    let nextSlugIndex = slugPath.indexOf("/", firstSlugIndex + 1);
    if (nextSlugIndex < 0) {
        nextSlugIndex = slugPath.length;
    }
    const langSlug = slugPath.slice(firstSlugIndex + 1, nextSlugIndex);
    let index = locMeta.findIndex(tuple => tuple[LOC_META_INDEX_IDENTIFIER] == langSlug);
    if (index >= 0) {
        if (nextSlugIndex < slugPath.length) {
            return slugPath.slice(nextSlugIndex);
        } else {
            return "/" + slugPath.slice(nextSlugIndex);
        }
    }
    return (slugPath.startsWith("/") ? slugPath : ("/" + slugPath));
}

/**
 * 
 * @param {String} langIdentifier 
 */
export function localizeLocation(langIdentifier) {
    return basePath + "/" + langIdentifier + getUnlocalizedSlug();
}

export const LOC_META_INDEX_IDENTIFIER = 0;
export const LOC_META_INDEX_LANGUAGE_CODE = 1;
export const LOC_META_INDEX_NAME = 2;
export const LOC_META_INDEX_TL_LANGUAGE = 3;
export const locMeta = [
    [
        "en", // Identifier
        "en", // Language code
        "English", // Name of language
        "Language", // Translation of the word "Language"
    ],
    [
        "jp",
        "ja",
        "日本語",
        "言語",
    ]
];
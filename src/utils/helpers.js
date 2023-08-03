import { config } from "../../application.config.js";

const { uploadsUrl } = config;

export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
}

/**
 * @desc  Sets page title to Whynot | {title}
 * @param {String} title
 */
export const setPageTitle = (title) => {
    document.title = title.toLowerCase() === 'home' ? `Whynot` : `Whynot | ${title}`;
}

/**
 * @desc  Sets page title to Admin | {title}
 * @param {String} title
 */
export const setAdminPageTitle = (title) => {
    document.title = title.toLowerCase() === 'admin' ? `Admin` : `Admin | ${title}`;
}

/**
 * @desc  Sets page title to Admin | {title}
 * @param {Object} product
 */
export const getImageUrl = (product) => {
    const prod = product.value ? product.value : product;
    if (Array.isArray(prod.imageUrls)) {
        if (prod.imageUrls.length)
            return prod.imageUrls[0]
        return `${uploadsUrl}/no-photo.jpeg`
    }
    return prod.imageUrls;
}


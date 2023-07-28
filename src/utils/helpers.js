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
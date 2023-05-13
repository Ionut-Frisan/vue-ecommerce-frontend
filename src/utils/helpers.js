export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
}
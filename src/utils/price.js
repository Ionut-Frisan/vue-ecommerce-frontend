export const getPriceWholePart = (value) => {
  return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
export const getPriceFloatPart = (value) => {
  let floatPart = value - parseInt((getPriceWholePart(value)).replaceAll('.', ''));
  floatPart = Math.round(floatPart * 100).toString();
  return floatPart.length === 2 ? floatPart : floatPart + '0'
}

export const getFormattedPrice = (value, discount = 0) => {
  const valueAfterDiscount = value * (1 - discount / 100);
  return { whole: getPriceWholePart(valueAfterDiscount), float: getPriceFloatPart(valueAfterDiscount) };
}
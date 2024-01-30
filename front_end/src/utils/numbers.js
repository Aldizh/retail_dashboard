export const formatPrice = (price, language) => {
  const decimalPrice = parseFloat(price).toFixed(2)
  switch (language) {
    case 'en':
      return `$${decimalPrice}`
    case 'al':
      return `${decimalPrice} lek`
    default:
      return `$${decimalPrice}`
  }
}

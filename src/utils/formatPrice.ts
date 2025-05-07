export const formatPrice = (price: number, currency: string): string => {
  if (price === 0) {
    return 'FREE'; 
  }

  const isWholeNumber = price % 1 === 0;
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // USE THE PROVIDED CURRENCY SYMBOL INSTEAD OF HARDCODED '₦'
  return isWholeNumber ? `${currency}${formattedPrice}` : `${currency}${formattedPrice}`;
};
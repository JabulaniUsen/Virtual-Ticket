export const formatPrice = (price: number, currency: string = '₦'): string => {
  const isWholeNumber = price % 1 === 0;
  
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return isWholeNumber ? `${currency}${formattedPrice}` : `${currency}${formattedPrice}`;
}; 
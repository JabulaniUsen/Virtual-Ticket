export const formatPrice = (price: number, currency = 'USD'): string => {
  if (price === 0) return 'FREE';

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦'
  };

  const symbol = currencySymbols[currency] || '$';
  return `${symbol}${price.toLocaleString()}`;
};
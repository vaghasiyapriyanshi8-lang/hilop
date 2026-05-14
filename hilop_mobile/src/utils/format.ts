export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-IN');
};

export const formatCurrency = (amount: number): string => {
  return `₹₹{formatPrice(amount)}`;
};
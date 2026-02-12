/**
 * Format duration from minutes to hours and minutes
 * @param minutes - Duration in minutes
 * @returns Formatted string like "1h 30m", "2h", or "45m"
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format price to ensure it's a valid number with 2 decimal places
 * @param price - Price as number or string
 * @returns Formatted price as number
 */
export const formatPrice = (price: number | string): number => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? 0 : numPrice;
};

/**
 * Format currency for display
 * @param amount - Amount to format
 * @returns Formatted currency string like "$120.00"
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = formatPrice(amount);
  return `$${numAmount.toFixed(2)}`;
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹ 0';
  return `₹ ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone;
};


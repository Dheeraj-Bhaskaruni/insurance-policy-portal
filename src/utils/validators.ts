export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const isValidZipCode = (zip: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value > 0 && isFinite(value);
};

export const isDateInFuture = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

export const isDateInPast = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

export const required = (value: string): string | undefined => {
  return value && value.trim().length > 0 ? undefined : 'This field is required';
};

export const minLength = (min: number) => (value: string): string | undefined => {
  return value && value.length >= min ? undefined : `Must be at least ${min} characters`;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  return value && value.length <= max ? undefined : `Must be no more than ${max} characters`;
};

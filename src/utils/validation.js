/**
 * Frontend Validation Utilities
 * Provides reusable validation functions for form inputs
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 * @param {string} password - Password to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate phone number format
 * Accepts 10-15 digit phone numbers
 * @param {string} phone - Phone number to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate quantity (must be positive integer)
 * @param {number|string} quantity - Quantity to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateQuantity = (quantity) => {
  const num = Number(quantity);
  if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
    return 'Quantity must be a positive whole number';
  }
  return null;
};

/**
 * Validate price (must be positive number)
 * @param {number|string} price - Price to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num <= 0) {
    return 'Price must be a positive number';
  }
  return null;
};

/**
 * Validate minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum required length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMinLength = (value, minLength, fieldName) => {
  if (!value || value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Validate maximum length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get validation error messages for common fields
 */
export const ValidationMessages = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_WEAK: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Invalid phone number format',
  FIELD_REQUIRED: (fieldName) => `${fieldName} is required`,
};

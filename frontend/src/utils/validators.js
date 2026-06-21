// src/utils/validators.js

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export const validatePassword = (password) => {
  return password.length >= 6;
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid
 */
export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 30;
};

/**
 * Validate task title
 * @param {string} title - Task title to validate
 * @returns {boolean} True if valid
 */
export const validateTaskTitle = (title) => {
  return title.trim().length > 0 && title.length <= 200;
};

/**
 * Validate task description
 * @param {string} description - Task description to validate
 * @returns {boolean} True if valid
 */
export const validateTaskDescription = (description) => {
  return !description || description.length <= 1000;
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if valid
 */
export const validateFileSize = (size, maxSize = 10 * 1024 * 1024) => {
  return size <= maxSize;
};

/**
 * Validate file extension
 * @param {string} filename - File name
 * @param {string[]} allowedExtensions - Allowed extensions
 * @returns {boolean} True if valid
 */
export const validateFileExtension = (filename, allowedExtensions = ['.txt', '.pdf']) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return allowedExtensions.includes(`.${ext}`);
};

/**
 * Get password strength score
 * @param {string} password - Password to check
 * @returns {number} Score from 0-5
 */
export const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 6) score++;
  if (password.match(/[a-z]/)) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[^a-zA-Z0-9]/)) score++;
  return score;
};

/**
 * Get password strength label
 * @param {number} score - Password strength score
 * @returns {string} Strength label
 */
export const getPasswordStrengthLabel = (score) => {
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return labels[Math.min(score - 1, 4)] || 'Weak';
};

/**
 * Get password strength color
 * @param {number} score - Password strength score
 * @returns {string} Color class
 */
export const getPasswordStrengthColor = (score) => {
  const colors = ['red', 'orange', 'yellow', 'green', 'emerald'];
  return colors[Math.min(score - 1, 4)] || 'red';
};

/**
 * Validate required fields
 * @param {Object} values - Form values
 * @param {string[]} fields - Required field names
 * @returns {Object} Validation errors
 */
export const validateRequired = (values, fields) => {
  const errors = {};
  fields.forEach(field => {
    if (!values[field]?.toString().trim()) {
      errors[field] = `${field} is required`;
    }
  });
  return errors;
};

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && !value?.toString().trim()) {
      errors[field] = rule.message || `${field} is required`;
      continue;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} is invalid`;
      continue;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
      continue;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field} must be at most ${rule.maxLength} characters`;
      continue;
    }
    
    if (value && rule.min && Number(value) < rule.min) {
      errors[field] = rule.message || `${field} must be at least ${rule.min}`;
      continue;
    }
    
    if (value && rule.max && Number(value) > rule.max) {
      errors[field] = rule.message || `${field} must be at most ${rule.max}`;
      continue;
    }
  }
  
  return errors;
};
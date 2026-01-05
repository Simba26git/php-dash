/**
 * Dashboard Utility Functions
 * Production-ready helper functions for the dashboard component
 */

import { DATE_FORMAT_OPTIONS } from '../config/dashboard.config.js';

/**
 * Safely format a date string
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date or fallback string
 */
export const formatDate = (dateString, options = DATE_FORMAT_OPTIONS) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Safely format a number with locale-specific formatting
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  try {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return num.toLocaleString();
  } catch (error) {
    return String(num);
  }
};

/**
 * Validate user object structure
 * @param {object} user - User object to validate
 * @returns {boolean} True if user object is valid
 */
export const isValidUser = (user) => {
  return (
    user &&
    typeof user === 'object' &&
    user.id &&
    user.name &&
    user.email &&
    user.created_at
  );
};

/**
 * Calculate date ranges for statistics
 * @returns {object} Date range objects
 */
export const getDateRanges = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  return { today, weekAgo, monthAgo, now };
};

/**
 * Calculate user statistics based on creation dates
 * @param {Array} users - Array of user objects
 * @returns {object} Statistics object
 */
export const calculateUserStats = (users) => {
  if (!Array.isArray(users) || users.length === 0) {
    return {
      todayJoined: 0,
      thisWeekJoined: 0,
      thisMonthJoined: 0,
    };
  }

  const { today, weekAgo, monthAgo } = getDateRanges();

  const countUsersByDate = (compareDate) => {
    return users.filter(u => {
      try {
        if (!isValidUser(u)) return false;
        const createdDate = new Date(u.created_at);
        return createdDate >= compareDate;
      } catch {
        return false;
      }
    }).length;
  };

  return {
    todayJoined: countUsersByDate(today),
    thisWeekJoined: countUsersByDate(weekAgo),
    thisMonthJoined: countUsersByDate(monthAgo),
  };
};

/**
 * Extract error message from various error formats
 * @param {Error|object} error - Error object
 * @returns {string} User-friendly error message
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // Check for response error (Axios format)
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for validation errors
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }

  // Check for regular error message
  if (error.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred';
};

/**
 * Debounce function for preventing rapid repeated calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if data is stale and needs refresh
 * @param {Date} lastUpdate - Last update timestamp
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {boolean} True if data is stale
 */
export const isDataStale = (lastUpdate, maxAge = 300000) => { // 5 minutes default
  if (!lastUpdate) return true;
  const now = new Date();
  return (now - lastUpdate) > maxAge;
};

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {any} fallback - Fallback value if parsing fails
 * @returns {any} Parsed object or fallback
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

/**
 * Validate API response structure
 * @param {object} response - API response object
 * @returns {boolean} True if response structure is valid
 */
export const isValidApiResponse = (response) => {
  return (
    response &&
    typeof response === 'object' &&
    (response.data !== undefined || response.success !== undefined)
  );
};

export default {
  formatDate,
  formatNumber,
  isValidUser,
  getDateRanges,
  calculateUserStats,
  extractErrorMessage,
  debounce,
  isDataStale,
  safeJsonParse,
  isValidApiResponse,
};

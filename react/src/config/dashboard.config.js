// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  // Refresh intervals (in milliseconds)
  AUTO_REFRESH_INTERVAL: 300000, // 5 minutes
  NOTIFICATION_DURATION: 5000, // 5 seconds

  // Data limits
  RECENT_USERS_LIMIT: 5,
  MAX_RETRY_ATTEMPTS: 3,

  // API endpoints
  HEALTH_CHECK_URL: `${import.meta.env.VITE_API_BASE_URL}/api/health`,

  // Feature flags
  ENABLE_AUTO_REFRESH: false,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ERROR_LOGGING: true,
};

// Date formatting options
export const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_RESPONSE: 'Received invalid data from server.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
};

export default DASHBOARD_CONFIG;

import { toast } from 'react-toastify';

// Error codes that should trigger logout
const AUTH_ERROR_CODES = ['TOKEN_EXPIRED', 'INVALID_TOKEN', 'NO_TOKEN', 'TOKEN_VERIFICATION_FAILED'];

// Handle API errors with specific actions
export const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error);
  
  const errorData = error.response?.data || error.data || {};
  const statusCode = error.response?.status || error.status || 500;
  const errorCode = errorData.code;
  const message = errorData.message || error.message || 'An unexpected error occurred';

  // Handle authentication errors
  if (statusCode === 401 || AUTH_ERROR_CODES.includes(errorCode)) {
    handleAuthError(errorCode, message);
    return { shouldLogout: true, message };
  }

  // Handle authorization errors
  if (statusCode === 403) {
    handleAuthorizationError(errorCode, message);
    return { shouldLogout: false, message };
  }

  // Handle validation errors
  if (statusCode === 400) {
    handleValidationError(errorCode, message);
    return { shouldLogout: false, message };
  }

  // Handle server errors
  if (statusCode >= 500) {
    handleServerError(message);
    return { shouldLogout: false, message: 'Server error. Please try again later.' };
  }

  // Handle rate limiting
  if (statusCode === 429) {
    handleRateLimitError(message);
    return { shouldLogout: false, message };
  }

  // Default error handling
  toast.error(message);
  return { shouldLogout: false, message };
};

const handleAuthError = (errorCode, message) => {
  switch (errorCode) {
    case 'TOKEN_EXPIRED':
      toast.error('Your session has expired. Please log in again.');
      break;
    case 'INVALID_TOKEN':
      toast.error('Invalid session. Please log in again.');
      break;
    case 'NO_TOKEN':
      toast.error('Please log in to continue.');
      break;
    default:
      toast.error(message || 'Authentication failed. Please log in again.');
  }
};

const handleAuthorizationError = (errorCode, message) => {
  switch (errorCode) {
    case 'ADMIN_REQUIRED':
      toast.error('Admin access required for this action.');
      break;
    case 'PROFILE_ACCESS_DENIED':
      toast.error('You can only access your own profile.');
      break;
    default:
      toast.error(message || 'Access denied.');
  }
};

const handleValidationError = (errorCode, message) => {
  switch (errorCode) {
    case 'USER_EXISTS':
      toast.error('An account with this email already exists.');
      break;
    case 'INVALID_CREDENTIALS':
      toast.error('Invalid email or password.');
      break;
    default:
      toast.error(message || 'Please check your input and try again.');
  }
};

const handleServerError = (message) => {
  console.error('Server error:', message);
  toast.error('Server error. Please try again later.');
};

const handleRateLimitError = (message) => {
  toast.error(message || 'Too many requests. Please wait before trying again.');
};

// Enhanced fetch wrapper with automatic error handling
export const apiRequest = async (url, options = {}, context = '') => {
  try {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = {
        response: {
          status: response.status,
          data: errorData
        }
      };
      
      const errorResult = handleApiError(error, context);
      
      // Return error info for caller to handle logout if needed
      return {
        ok: false,
        status: response.status,
        data: errorData,
        shouldLogout: errorResult.shouldLogout,
        error: errorResult.message
      };
    }

    const data = await response.json();
    return {
      ok: true,
      status: response.status,
      data,
      shouldLogout: false
    };

  } catch (error) {
    console.error(`Network error in ${context}:`, error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return {
      ok: false,
      status: 0,
      data: null,
      shouldLogout: false,
      error: error.message
    };
  }
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();
      
      if (result.ok || result.shouldLogout || result.status === 400) {
        return result;
      }
      
      if (attempt === maxRetries) {
        return result;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export default {
  handleApiError,
  apiRequest,
  retryRequest
};
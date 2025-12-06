// API Error Handler Utility
export const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error);
  
  // Don't throw errors that would cause infinite loops
  if (error.status === 429) {
    console.warn(`Rate limited in ${context} - skipping request`);
    return null;
  }
  
  if (error.status === 500) {
    console.warn(`Server error in ${context} - skipping request`);
    return null;
  }
  
  if (error.status === 401) {
    console.warn(`Unauthorized in ${context} - token may be invalid`);
    return null;
  }
  
  if (error.status === 404) {
    console.warn(`Not found in ${context} - resource may not exist`);
    return null;
  }
  
  return error;
};

// Safe API fetch with error handling
export const safeFetch = async (url, options = {}, context = '') => {
  try {
    const response = await fetch(url, options);
    
    // Handle common error status codes
    if (response.status === 429) {
      console.warn(`Rate limited: ${context}`);
      return { ok: false, status: 429, data: null };
    }
    
    if (response.status === 500) {
      console.warn(`Server error: ${context}`);
      return { ok: false, status: 500, data: null };
    }
    
    if (response.status === 401) {
      console.warn(`Unauthorized: ${context}`);
      return { ok: false, status: 401, data: null };
    }
    
    if (response.status === 404) {
      console.warn(`Not found: ${context}`);
      return { ok: false, status: 404, data: null };
    }
    
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
    
  } catch (error) {
    console.error(`Network error in ${context}:`, error);
    return { ok: false, status: 0, data: null, error: error.message };
  }
};

// Debounce utility to prevent rapid API calls
export const debounce = (func, wait) => {
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

// Rate limiting utility
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }
  
  canMakeRequest(key, limit = 5, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= limit) {
      console.warn(`Rate limit exceeded for ${key}`);
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
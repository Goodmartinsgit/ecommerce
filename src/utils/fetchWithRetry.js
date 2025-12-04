/**
 * Fetch with automatic retry logic
 * Retries failed requests with exponential backoff
 */

/**
 * Perform fetch with retry logic
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options (headers, method, body, etc.)
 * @param {number} retries - Maximum number of retries (default: 3)
 * @param {number} delay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise<Response>} The fetch response
 */
export const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry client errors (4xx) - these are usually permanent
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // Retry server errors (5xx) or network errors
      if (response.status >= 500 && attempt < retries - 1) {
        console.warn(`Server error (${response.status}), retrying... (attempt ${attempt + 1}/${retries})`);
        await sleep(delay * (attempt + 1)); // Exponential backoff
        continue;
      }

      // Success or final attempt
      return response;
    } catch (error) {
      // Network error or fetch failed
      if (attempt < retries - 1) {
        console.warn(`Network error, retrying... (attempt ${attempt + 1}/${retries}):`, error.message);
        await sleep(delay * (attempt + 1)); // Exponential backoff
        continue;
      }

      // Final attempt failed - rethrow the error
      throw error;
    }
  }
};

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wrapper for common API calls with retry logic
 */
export const api = {
  /**
   * GET request with retry
   * @param {string} url - The URL to fetch
   * @param {object} headers - Request headers
   * @param {number} retries - Number of retries
   * @returns {Promise<Response>}
   */
  get: async (url, headers = {}, retries = 3) => {
    return fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, retries);
  },

  /**
   * POST request with retry
   * @param {string} url - The URL to fetch
   * @param {object} data - Request body data
   * @param {object} headers - Request headers
   * @param {number} retries - Number of retries
   * @returns {Promise<Response>}
   */
  post: async (url, data, headers = {}, retries = 3) => {
    return fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    }, retries);
  },

  /**
   * PATCH request with retry
   * @param {string} url - The URL to fetch
   * @param {object} data - Request body data
   * @param {object} headers - Request headers
   * @param {number} retries - Number of retries
   * @returns {Promise<Response>}
   */
  patch: async (url, data, headers = {}, retries = 3) => {
    return fetchWithRetry(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    }, retries);
  },

  /**
   * DELETE request with retry
   * @param {string} url - The URL to fetch
   * @param {object} data - Request body data (optional)
   * @param {object} headers - Request headers
   * @param {number} retries - Number of retries
   * @returns {Promise<Response>}
   */
  delete: async (url, data = null, headers = {}, retries = 3) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetchWithRetry(url, options, retries);
  }
};

export default fetchWithRetry;

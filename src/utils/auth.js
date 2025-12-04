import { jwtDecode } from 'jwt-decode';

/**
 * Get token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove token and user data from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated with a valid token
 * @returns {boolean} true if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Get decoded user data from token
 * @returns {object|null} Decoded token payload or null
 */
export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} true if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

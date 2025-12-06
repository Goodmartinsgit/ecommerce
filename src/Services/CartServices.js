import { baseUrl } from '../config/config';
import { safeFetch } from '../utils/apiErrorHandler';

// Add item to cart (authenticated users)
export const addToCart = async (userId, productId, color, size, quantity, token) => {
  if (!token) {
    console.warn('No token provided for addToCart');
    return { ok: false, error: 'Authentication required', status: 401 };
  }
  
  return await safeFetch(`${baseUrl}cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userid: userId,
      productid: productId,
      color: color || null,
      size: size || null,
      quantity: quantity || 1
    })
  }, 'addToCart');
};

// Get user cart
export const getCart = async (userId, token) => {
  if (!token) {
    console.warn('No token provided for getCart');
    return { ok: false, error: 'Authentication required', status: 401 };
  }
  
  if (!userId) {
    console.warn('No userId provided for getCart');
    return { ok: false, error: 'User ID required', status: 400 };
  }
  
  return await safeFetch(`${baseUrl}cart/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }, 'getCart');
};

// Update cart item
export const updateCart = async (userId, productId, size, color, quantity, token) => {
  try {
    const res = await fetch(`${baseUrl}cart`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userid: userId,
        productid: productId,
        size: size,
        color: color,
        quantity: quantity
      })
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error('Update cart error:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

// Delete item from cart
export const deleteFromCart = async (userId, productId, token) => {
  try {
    const res = await fetch(`${baseUrl}cart/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productid: productId
      })
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error('Delete from cart error:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

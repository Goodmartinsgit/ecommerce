import { baseUrl } from '../config/config';

// Get user wishlist
export const getWishlist = async (token) => {
  try {
    const res = await fetch(`${baseUrl}wishlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error('Get wishlist error:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

// Add product to wishlist
export const addToWishlist = async (productId, token) => {
  try {
    const res = await fetch(`${baseUrl}wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: productId
      })
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId, token) => {
  try {
    const res = await fetch(`${baseUrl}wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

// Clear entire wishlist
export const clearWishlist = async (token) => {
  try {
    const res = await fetch(`${baseUrl}wishlist/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error('Clear wishlist error:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

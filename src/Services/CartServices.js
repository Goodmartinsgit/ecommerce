import axiosInstance from '../utils/axiosInstance';

// Add item to cart (authenticated users)
export const addToCart = async (userId, productId, color, size, quantity) => {
  try {
    const response = await axiosInstance.post('cart', {
      userid: userId,
      productid: productId,
      color: color || null,
      size: size || null,
      quantity: quantity || 1
    });
    
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Add to cart error:', error.message);
    return { 
      ok: false, 
      error: error.message || 'Failed to add item to cart',
      code: error.code,
      status: error.status
    };
  }
};

// Get user cart
export const getCart = async (userId) => {
  try {
    if (!userId) {
      return { ok: false, error: 'User ID required', status: 400 };
    }
    
    const response = await axiosInstance.get(`cart/${userId}`);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Get cart error:', error.message);
    return { 
      ok: false, 
      error: error.message || 'Failed to fetch cart',
      code: error.code,
      status: error.status
    };
  }
};

// Update cart item
export const updateCart = async (userId, productId, size, color, quantity) => {
  try {
    const response = await axiosInstance.patch('cart', {
      userid: userId,
      productid: productId,
      size: size,
      color: color,
      quantity: quantity
    });
    
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Update cart error:', error.message);
    return { 
      ok: false, 
      error: error.message || 'Failed to update cart',
      code: error.code,
      status: error.status
    };
  }
};

// Delete item from cart
export const deleteFromCart = async (userId, productId) => {
  try {
    const response = await axiosInstance.delete(`cart/${userId}`, {
      data: { productId: productId }
    });
    
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Delete from cart error:', error.message);
    return { 
      ok: false, 
      error: error.message || 'Failed to delete item from cart',
      code: error.code,
      status: error.status
    };
  }
};

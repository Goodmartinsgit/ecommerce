import axiosInstance from '../utils/axiosInstance';

/**
 * Get payment configuration from backend
 * @param {string} token - Authentication token
 * @returns {Promise<{publicKey: string, currency: string}>}
 */
export const getPaymentConfig = async (token) => {
  try {
    const response = await axiosInstance.get('payment/config', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return {
      publicKey: response.data.flutterwavePublicKey,
      currency: response.data.currency || 'NGN'
    };
  } catch (error) {
    console.error('Error fetching payment config:', error);
    throw error;
  }
};

/**
 * Initialize payment with backend
 * @param {string} token - Authentication token  
 * @param {string} email - User email
 * @returns {Promise<{link: string, orderId: string}>}
 */
export const initializePayment = async (token, email) => {
  try {
    const response = await axiosInstance.post('payment/initialize', 
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return {
      link: response.data.link,
      orderId: response.data.orderId
    };
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

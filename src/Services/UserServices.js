import { baseUrl } from '../config/config'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from '../utils/axiosInstance'

export const registerUser = async formData => {
  try {
    const res = await fetch(`${baseUrl}users/register`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Registration failed:', data.message)
      return { 
        ok: false, 
        error: data.message || 'Registration failed',
        code: data.code
      }
    }

    return { ok: true, data }
  } catch (error) {
    console.error('Registration error:', error.message)
    return { 
      ok: false, 
      error: error.message || 'Network error. Please try again.',
      code: 'NETWORK_ERROR'
    }
  }
}

export const loginUser = async (userData, userCart) => {
  try {
    const res = await fetch(`${baseUrl}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Login failed:', data.message)
      return { 
        ok: false, 
        error: data.message || 'Login failed',
        code: data.code || 'LOGIN_FAILED'
      }
    }

    const token = data.token

    if (!token) {
      console.error('No token received from server')
      return { 
        ok: false, 
        error: 'Authentication failed. No token received.',
        code: 'NO_TOKEN'
      }
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(data.data))

    let decoded
    try {
      decoded = jwtDecode(token)
    } catch (err) {
      console.error('Token decode error:', err)
      return { 
        ok: false, 
        error: 'Invalid token format',
        code: 'INVALID_TOKEN'
      }
    }

    if (decoded.exp * 1000 < Date.now()) {
      console.error('Token already expired')
      return { 
        ok: false, 
        error: 'Session expired',
        code: 'TOKEN_EXPIRED'
      }
    }

    // Sync cart items
    if (userCart.length > 0) {
      try {
        const syncResults = await Promise.allSettled(
          userCart.filter(item => item && item.id).map(async item => {
            try {
              const response = await axiosInstance.post('cart', {
                userid: decoded.id,
                productid: item?.id,
                color: item?.color,
                size: item?.size,
                quantity: item?.quantity
              })

              return { success: true, itemId: item.id }
            } catch (itemError) {
              console.warn(`Failed to sync item ${item.id}:`, itemError.message)
              return { success: false, itemId: item.id, error: itemError.message }
            }
          })
        )

        const successful = syncResults.filter(r => r.status === 'fulfilled' && r.value?.success)
        console.log(`Synced ${successful.length} of ${userCart.length} cart items`)
      } catch (syncError) {
        console.error('Cart sync error:', syncError)
      }
    }

    localStorage.removeItem('CartItems')

    return { ok: true, data, token }
  } catch (error) {
    console.error('Login error:', error.message)
    return { 
      ok: false, 
      error: error.message || 'Network error. Please try again.',
      code: 'NETWORK_ERROR'
    }
  }
}

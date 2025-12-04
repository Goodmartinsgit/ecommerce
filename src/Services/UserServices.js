import { baseUrl } from '../config/config'
import { jwtDecode } from 'jwt-decode'
export const registerUser = async formData => {
  try {
    const res = await fetch(`${baseUrl}users/register`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    console.log('res', data)

    return { ok: res.ok, data }
  } catch (error) {
    console.log('error:', error.message)
    return { ok: false, error: error.message }
  }
}

export const loginUser = async (userData, userCart) => {
  try {
    //make req
    const res = await fetch(`${baseUrl}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    //get response
    const data = await res.json()

    // Check if response was successful first
    if (!res.ok) {
      return { ok: false, data, error: data.message || 'Login failed' }
    }

    // Token is always in response body
    const token = data.token
    console.log('token', token)

    if (!token) {
      return { ok: false, data, error: 'No token received' }
    }

    // Store token and user data immediately
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(data.data))

    let decoded
    try {
      decoded = jwtDecode(token)
      console.log('decoded', decoded)
    } catch {
      return { ok: false, data, error: 'Invalid token format' }
    }

    if (decoded.exp * 1000 < Date.now()) {
      return { ok: false, data, error: 'Session expired' }
    }

    // Sync cart items from localStorage with improved error handling
    if (userCart.length > 0) {
      try {
        const syncResults = await Promise.allSettled(
          userCart.filter(item => item && item.id).map(async item => {
            try {
              const response = await fetch(`${baseUrl}cart`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  userid: decoded.id,
                  productid: item?.id,
                  color: item?.color,
                  size: item?.size,
                  quantity: item?.quantity
                })
              })

              const cartRes = await response.json()

              if (!response.ok) {
                console.warn(`Failed to sync item ${item.id}:`, cartRes.message)
                return { success: false, itemId: item.id, error: cartRes.message }
              }

              return { success: true, itemId: item.id }
            } catch (itemError) {
              console.error(`Error syncing item ${item.id}:`, itemError)
              return { success: false, itemId: item.id, error: itemError.message }
            }
          })
        )

        // Log sync results
        const failed = syncResults.filter(r => r.status === 'rejected' || !r.value?.success)
        const successful = syncResults.filter(r => r.status === 'fulfilled' && r.value?.success)

        if (failed.length > 0) {
          console.warn(`${failed.length} of ${userCart.length} cart items failed to sync`)
        }

        console.log(`Successfully synced ${successful.length} of ${userCart.length} cart items`)
      } catch (syncError) {
        console.error('Cart sync error:', syncError)
        // Continue with login even if sync fails
      }
    }

    // Always clear local cart after successful login, regardless of sync status
    // This prevents duplicate items from appearing after login
    localStorage.removeItem('CartItems')

    return { ok: res.ok, data, token }
  } catch (error) {
    console.log('error', error.message)
    return { ok: false, error: error.message }
  }
}

// Placeholder image as a data URL - avoids external dependencies
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect fill="%23e5e7eb" width="400" height="500"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="24" text-anchor="middle" x="200" y="250"%3ENo Image%3C/text%3E%3C/svg%3E';

/**
 * Get product image URL or fallback to placeholder
 * @param {string} imageUrl - Original image URL
 * @returns {string} Image URL or placeholder
 */
export const getProductImage = (imageUrl) => {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return PLACEHOLDER_IMAGE;
};

/**
 * Handle image load error by setting a fallback
 * @param {Event} event - Image error event
 */
export const handleImageError = (event) => {
  event.target.src = PLACEHOLDER_IMAGE;
  event.target.onerror = null; // Prevent infinite loop
};

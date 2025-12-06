
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "../config/config";
import { addToCart as addToCartAPI, getCart as getCartAPI, updateCart as updateCartAPI, deleteFromCart as deleteFromCartAPI } from "../Services/CartServices";
import { addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI, getWishlist as getWishlistAPI } from "../Services/WishlistServices";
import { isAuthenticated as isValidToken } from "../utils/auth";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("CartItems")) || []
  );
  const [wishlistItems, setWishlistItems] = useState(
    JSON.parse(localStorage.getItem("WishlistItems")) || []
  );
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.reduce((acc, curr) => acc + curr?.quantity, 0);
      setCartCount(count);
    }
  }, [cartItems]);
  useEffect(() => {
    if (wishlistItems && Array.isArray(wishlistItems)) {
      setWishlistCount(wishlistItems.length);
    }
  }, [wishlistItems]);

  const HandleAddToCart = async (prod, quantity = 1, size = null, color = null) => {
    // Always update localStorage for guest cart
    let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

    // Find if product already exists in the cart with same size and color
    const existingItem = storedCartItems.find(
      (item) =>
        parseInt(item.id) === parseInt(prod.id) &&
        item.size === size &&
        item.color === color
    );

    let updatedCartItems;
    if (existingItem) {
      // Update quantity for existing item with same size and color
      updatedCartItems = storedCartItems.map((item) =>
        parseInt(item.id) === parseInt(prod.id) &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      toast.success("Cart quantity updated");
    } else {
      // Add a new product entry if it doesn't exist
      updatedCartItems = [
        ...storedCartItems,
        { ...prod, quantity, size, color },
      ];
      toast.success("Item added to cart successfully");
    }

    // Save updated cart in localStorage
    localStorage.setItem("CartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);

    // If authenticated, also sync with backend
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        const response = await addToCartAPI(user.id, prod.id, size, color, quantity, token);

        if (!response.ok) {
          console.error('Failed to sync cart with backend:', response);
          // Don't logout or show error - local cart is already updated
        }
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
        // Don't show error to user, local cart is still updated
      }
    }
  };

  const HandleUpdateCartItem = async (cartIndex, updates) => {
    let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

    // Validate cart index
    if (cartIndex < 0 || cartIndex >= storedCartItems.length) {
      toast.error("Invalid cart item");
      return;
    }

    // const oldItem = storedCartItems[cartIndex];

    // Update the specific item
    storedCartItems[cartIndex] = {
      ...storedCartItems[cartIndex],
      ...updates,
    };

    // Save to localStorage and update state
    localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
    setCartItems(storedCartItems);
    toast.success("Cart updated successfully");

    // If authenticated, also sync with backend
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        const updatedItem = storedCartItems[cartIndex];
        const response = await updateCartAPI(user.id, updatedItem.id, updatedItem.size, updatedItem.color, updatedItem.quantity, token);

        if (!response.ok) {
          console.error('Failed to sync cart update with backend:', response);
          // Don't logout or show error - local cart is already updated
        }
      } catch (error) {
        console.error("Failed to sync cart update with backend:", error);
        // Don't show error to user, local cart is still updated
      }
    }
  };

  const HandleRemoveFromCart = async (cartIndex) => {
    let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

    // Validate cart index
    if (cartIndex < 0 || cartIndex >= storedCartItems.length) {
      toast.error("Invalid cart item");
      return;
    }

    const itemToRemove = storedCartItems[cartIndex];

    // Remove item at the specified index
    storedCartItems.splice(cartIndex, 1);

    // Save to localStorage and update state
    localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
    setCartItems(storedCartItems);
    toast.success("Item removed from cart");

    // If authenticated, also sync with backend
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        const response = await deleteFromCartAPI(user.id, itemToRemove.id, token);

        if (!response.ok) {
          console.error('Failed to sync cart removal with backend:', response);
          // Don't logout or show error - local cart is already updated
        }
      } catch (error) {
        console.error("Failed to sync cart removal with backend:", error);
        // Don't show error to user, local cart is still updated
      }
    }
  };

  // Wishlist Functions
  const HandleToggleWishlist = async (product) => {
    if (!product || !product.id) {
      toast.error("Invalid product");
      return;
    }

    // Check if product is already in wishlist
    let storedWishlistItems = JSON.parse(localStorage.getItem("WishlistItems")) || [];
    const existingIndex = storedWishlistItems.findIndex(
      (item) => parseInt(item.id) === parseInt(product.id)
    );

    let updatedWishlistItems;
    const isRemoving = existingIndex !== -1;

    if (isRemoving) {
      // Remove from wishlist
      updatedWishlistItems = storedWishlistItems.filter(
        (item) => parseInt(item.id) !== parseInt(product.id)
      );
    } else {
      // Add to wishlist
      updatedWishlistItems = [...storedWishlistItems, product];
    }

    // Update local state immediately for better UX
    localStorage.setItem("WishlistItems", JSON.stringify(updatedWishlistItems));
    setWishlistItems(updatedWishlistItems);

    // If authenticated, sync with backend
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to sync wishlist");
          return;
        }

        let response;
        if (isRemoving) {
          response = await removeFromWishlistAPI(product.id, token);
          if (response.ok) {
            toast.success("Removed from wishlist");
          } else {
            throw new Error(response.data?.message || "Failed to remove from wishlist");
          }
        } else {
          response = await addToWishlistAPI(product.id, token);
          if (response.ok) {
            toast.success("Added to wishlist");
          } else if (response.data?.message === "Product already in wishlist") {
            // Backend says it's already there, sync with backend state
            await HandleGetWishlist();
            toast.info("Product was already in wishlist");
          } else {
            throw new Error(response.data?.message || "Failed to add to wishlist");
          }
        }
      } catch (error) {
        console.error("Failed to sync wishlist with backend:", error);
        // Revert local state on backend failure
        localStorage.setItem("WishlistItems", JSON.stringify(storedWishlistItems));
        setWishlistItems(storedWishlistItems);
        toast.error(error.message || "Failed to update wishlist");
      }
    } else {
      // For guest users, just show success message
      if (isRemoving) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    }
  };

  const HandleGetWishlist = async () => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return wishlistItems;
        
        const response = await getWishlistAPI(token);

        if (response.status === 429) {
          console.warn('Rate limited - skipping wishlist fetch');
          return wishlistItems;
        }

        if (response.ok && response.data) {
          const wishlistProducts = response.data.items?.map(item => item.product) || [];
          setWishlistItems(wishlistProducts);
          localStorage.setItem("WishlistItems", JSON.stringify(wishlistProducts));
          return wishlistProducts;
        } else {
          console.error("Failed to fetch wishlist:", response);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    }
    return wishlistItems;
  };

  const IsInWishlist = (productId) => {
    return wishlistItems.some((item) => parseInt(item.id) === parseInt(productId));
  };

  const HandleGetProducts = useCallback(async () => {
    if (isLoadingProducts) return;

    try {
      setIsLoadingProducts(true);
      const res = await fetch(`${baseUrl}products`, {
        method: "GET",
      });

      if (res.status === 429) {
        console.warn('Rate limited - skipping products fetch');
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();
      if (response.success && response.data) {
        setProductData(response.data);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProductData([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [isLoadingProducts]);

  useEffect(() => {
    // Check if user is logged in with valid token
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        if (isValidToken()) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }

    // Fetch products once on app load - only if not already loaded
    if (!productData) {
      HandleGetProducts();
    }
  }, []);

  const HandleLogin = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    // Sync token state with localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    // Fetch wishlist after login
    setTimeout(() => {
      HandleGetWishlist();
    }, 100);
  };

  const HandleLogout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("CartItems");
    localStorage.removeItem("WishlistItems");
    setWishlistItems([]);
  };
  const HandleUpdateCart = async (prod) => {
    try {
      const storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

      //checking if product exist
      const existingProduct = storedCartItems.find(
        (item) => parseInt(item?.id) === parseInt(prod?.id)
      );

      if (!existingProduct) {
        toast.error("Product does not exist in cart!");
        return;
      }

      const updatedCartItems = storedCartItems.map((item) =>
        parseInt(item?.id) === parseInt(prod?.id)
          ? {
              ...item,
              size: prod?.size ?? item?.size,
              quantity: prod?.quantity ?? item?.quantity,
              color: prod?.color ?? item?.color,
            }
          : item
      );

      localStorage.setItem("CartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      toast.success("Cart updated successfully");

      // If authenticated, also sync with backend
      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem("token");
          const updatedProduct = updatedCartItems.find(
            (item) => parseInt(item?.id) === parseInt(prod?.id)
          );
          const response = await updateCartAPI(user.id, updatedProduct.id, updatedProduct.size, updatedProduct.color, updatedProduct.quantity, token);

          if (!response.ok) {
            console.error('Failed to sync cart update with backend:', response);
            // Don't logout or show error - local cart is already updated
          }
        } catch (error) {
          console.error("Failed to sync cart update with backend:", error);
          // Don't show error to user, local cart is still updated
        }
      }
    } catch (error) {
      toast.error(`Failed to update cart: ${error?.message}`);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts,
        productData,
        isLoadingProducts,
        HandleAddToCart,
        HandleUpdateCartItem,
        HandleRemoveFromCart,
        cartItems,
        setCartItems,
        cartCount,
        wishlistItems,
        setWishlistItems,
        wishlistCount,
        HandleToggleWishlist,
        HandleGetWishlist,
        IsInWishlist,
        isAuthenticated,
        user,
        token,
        setUser,
        HandleLogin,
        HandleLogout,
        setIsAuthenticated,
        HandleUpdateCart
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;




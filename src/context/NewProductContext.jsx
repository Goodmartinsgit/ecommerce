
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
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.reduce((acc, curr) => acc + (curr?.quantity || 0), 0);
      setCartCount(count);
    }
  }, [cartItems]);

  useEffect(() => {
    if (wishlistItems && Array.isArray(wishlistItems)) {
      setWishlistCount(wishlistItems.length);
    }
  }, [wishlistItems]);

  const HandleGetCart = async () => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        const response = await getCartAPI(user.id, token);

        if (response.ok && response.data) {
          const serverCart = response.data.data || response.data;
          const items = serverCart.productCarts || [];
          setCartItems(items);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("CartItems")) || [];
      setCartItems(localCart);
    }
  };

  const SyncGuestCartToServer = async () => {
    const guestCart = JSON.parse(localStorage.getItem("CartItems")) || [];
    if (guestCart.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const serverCartResponse = await getCartAPI(user.id, token);
      const serverItems = serverCartResponse?.data?.productCarts || [];
      
      for (const item of guestCart) {
        const existsInServer = serverItems.some(
          (serverItem) => 
            serverItem.productId === item.id &&
            serverItem.selectedSize === (item.size || item.selectedSize) &&
            serverItem.selectedColor === (item.color || item.selectedColor)
        );
        
        if (!existsInServer) {
          await addToCartAPI(
            user.id,
            item.id,
            item.size || item.selectedSize,
            item.color || item.selectedColor,
            item.quantity,
            token
          );
        }
      }
      localStorage.removeItem("CartItems");
      await HandleGetCart();
    } catch (error) {
      console.error("Failed to sync guest cart:", error);
    }
  };

  // Sync guest wishlist to server on login
  const SyncGuestWishlistToServer = async () => {
    const guestWishlist = JSON.parse(localStorage.getItem("WishlistItems")) || [];
    if (guestWishlist.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get current server wishlist to avoid duplicates
      const serverWishlistResponse = await getWishlistAPI(token);
      const serverItems = serverWishlistResponse?.data?.data?.items || 
                          serverWishlistResponse?.data?.items || [];
      const serverProductIds = serverItems.map(item => item.product?.id || item.productId);

      // Add guest wishlist items that don't exist on server
      for (const item of guestWishlist) {
        const productId = item.id || item.productId;
        if (!serverProductIds.includes(productId)) {
          try {
            await addToWishlistAPI(productId, token);
          } catch (err) {
            console.warn(`Failed to sync wishlist item ${productId}:`, err);
          }
        }
      }

      // Clear guest wishlist after sync
      localStorage.removeItem("WishlistItems");
    } catch (error) {
      console.error("Failed to sync guest wishlist:", error);
    }
  };

  const HandleAddToCart = async (prod, quantity = 1, size = null, color = null) => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("token");
        const response = await addToCartAPI(user.id, prod.id, size, color, quantity, token);

        if (response.ok) {
          await HandleGetCart();
          toast.success(response.data?.message || "Item added to cart");
        } else {
          toast.error(response.data?.message || "Failed to add to cart");
        }
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add to cart");
      }
    } else {
      let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];
      const existingItem = storedCartItems.find(
        (item) => parseInt(item.id) === parseInt(prod.id) && item.size === size && item.color === color
      );

      if (existingItem) {
        storedCartItems = storedCartItems.map((item) =>
          parseInt(item.id) === parseInt(prod.id) && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success("Cart quantity updated");
      } else {
        storedCartItems.push({ ...prod, quantity, size, color });
        toast.success("Item added to cart");
      }

      localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
      setCartItems(storedCartItems);
    }
  };

  const HandleUpdateCartItem = async (cartIndex, updates) => {
    if (isAuthenticated && user) {
      const item = cartItems[cartIndex];
      if (!item) {
        toast.error("Invalid cart item");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await updateCartAPI(
          user.id,
          item.product?.id || item.productId,
          updates.size || item.selectedSize || item.size,
          updates.color || item.selectedColor || item.color,
          updates.quantity || item.quantity,
          token
        );

        if (response.ok) {
          await HandleGetCart();
          toast.success("Cart updated successfully");
        } else {
          toast.error("Failed to update cart");
        }
      } catch (error) {
        console.error("Update cart error:", error);
        toast.error("Failed to update cart");
      }
    } else {
      let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];
      if (cartIndex < 0 || cartIndex >= storedCartItems.length) {
        toast.error("Invalid cart item");
        return;
      }

      storedCartItems[cartIndex] = { ...storedCartItems[cartIndex], ...updates };
      localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
      setCartItems(storedCartItems);
      toast.success("Cart updated successfully");
    }
  };

  const HandleRemoveFromCart = async (cartIndex) => {
    if (isAuthenticated && user) {
      const item = cartItems[cartIndex];
      if (!item) {
        toast.error("Invalid cart item");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await deleteFromCartAPI(user.id, item.product?.id || item.productId, token);

        if (response.ok) {
          await HandleGetCart();
          toast.success("Item removed from cart");
        } else {
          toast.error("Failed to remove item");
        }
      } catch (error) {
        console.error("Remove from cart error:", error);
        toast.error("Failed to remove item");
      }
    } else {
      let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];
      if (cartIndex < 0 || cartIndex >= storedCartItems.length) {
        toast.error("Invalid cart item");
        return;
      }

      storedCartItems.splice(cartIndex, 1);
      localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
      setCartItems(storedCartItems);
      toast.success("Item removed from cart");
    }
  };

  const HandleToggleWishlist = async (product) => {
    if (!product || !product.id) {
      toast.error("Invalid product");
      return;
    }

    let storedWishlistItems = JSON.parse(localStorage.getItem("WishlistItems")) || [];
    const existingIndex = storedWishlistItems.findIndex(
      (item) => parseInt(item.id) === parseInt(product.id)
    );

    let updatedWishlistItems;
    const isRemoving = existingIndex !== -1;

    if (isRemoving) {
      updatedWishlistItems = storedWishlistItems.filter(
        (item) => parseInt(item.id) !== parseInt(product.id)
      );
    } else {
      updatedWishlistItems = [...storedWishlistItems, product];
    }

    localStorage.setItem("WishlistItems", JSON.stringify(updatedWishlistItems));
    setWishlistItems(updatedWishlistItems);

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
            await HandleGetWishlist();
            toast.info("Product was already in wishlist");
          } else {
            throw new Error(response.data?.message || "Failed to add to wishlist");
          }
        }
      } catch (error) {
        console.error("Failed to sync wishlist with backend:", error);
        localStorage.setItem("WishlistItems", JSON.stringify(storedWishlistItems));
        setWishlistItems(storedWishlistItems);
        toast.error(error.message || "Failed to update wishlist");
      }
    } else {
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
          const wishlistData = response.data.data || response.data;
          const wishlistProducts = wishlistData.items?.map(item => item.product) || [];
          setWishlistItems(wishlistProducts);
          localStorage.setItem("WishlistItems", JSON.stringify(wishlistProducts));
          return wishlistProducts;
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
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        if (isValidToken()) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setTimeout(() => {
            HandleGetCart();
            HandleGetWishlist();
          }, 500);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
          // Load guest cart and wishlist from localStorage
          const localCart = JSON.parse(localStorage.getItem("CartItems")) || [];
          const localWishlist = JSON.parse(localStorage.getItem("WishlistItems")) || [];
          setCartItems(localCart);
          setWishlistItems(localWishlist);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        // Load guest cart and wishlist from localStorage
        const localCart = JSON.parse(localStorage.getItem("CartItems")) || [];
        const localWishlist = JSON.parse(localStorage.getItem("WishlistItems")) || [];
        setCartItems(localCart);
        setWishlistItems(localWishlist);
      }
    } else {
      // No stored user - load guest cart and wishlist from localStorage
      const localCart = JSON.parse(localStorage.getItem("CartItems")) || [];
      const localWishlist = JSON.parse(localStorage.getItem("WishlistItems")) || [];
      setCartItems(localCart);
      setWishlistItems(localWishlist);
    }

    HandleGetProducts();
  }, [HandleGetProducts]);

  const HandleLogin = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    // Sync guest cart and wishlist to server
    await SyncGuestCartToServer();
    await SyncGuestWishlistToServer();
    // Fetch updated data from server
    await HandleGetCart();
    await HandleGetWishlist();
  };

  const HandleLogout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setCartItems([]);
    setWishlistItems([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("CartItems");
    localStorage.removeItem("WishlistItems");
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
        HandleGetCart,
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
        SyncGuestCartToServer
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;

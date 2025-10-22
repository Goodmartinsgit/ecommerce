// import { createContext, useEffect, useState } from "react";

// export const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [productData, setProductData] = useState(null);
//   const [isAuthentified, setIsAuthentified] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [cartItems, setCartItems] = useState(
//     JSON.parse(localStorage.getItem("cartItems")) || []
//   );

//   useEffect(() => {
//     console.log("Cart:", cartItems);
//     if (cartItems) {
//       const count = cartItems?.reduce((acc, curr) => acc + curr?.quantity, 0);

//       setCartCount(count);
//     }
//   }, [cartItems]);

//   const HandleAddTCart = (prod, quantity = null, size = null, color = null) => {
//     if (!isAuthentified) {
//       //Get existing cart or initialize
//       let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

//       //Find if product already exists in the cart
//       const existingItem = storedCartItems.find(
//         (item) => parseInt(item.id) === parseInt(prod.id)
//       );

//       let updatedCartitems;
//       if (existingItem) {
//         //Create a new arry with updated quantity for the exixting item
//         updatedCartitems = storedCartItems.map((item) =>
//           parseInt(item.id) === parseInt(prod.id)
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         //add a new product entry if it doesen't exixt
//         updatedCartitems = [
//           ...storedCartItems,
//           { ...prod, quantity, size, color },
//         ];
//       }

//       //Save updated cart in localStorage
//       localStorage.setItem("CartItems", JSON.stringify(updatedCartitems));
//       setCartItems(updatedCartitems);
//       console.log("Updated cart:", updatedCartitems);
//     } else {
//       console.log("User is authenticated - handle API cart instead");
//     }
//   };

//   const HandleGetProducts = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/products", {
//         method: "GET",
//       });

//       const data = await res.json();
//       if (res.ok) {
//         console.log(data);
//         setProductData(data);
//       } else {
//         console.log("unable to fetch");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   return (
//     <ProductContext.Provider
//       value={{ HandleGetProducts, productData, HandleAddTCart, cartItems, cartCount, setIsAuthentified }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };







import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null);
  const [isAuthentified, setIsAuthentified] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("CartItems")) || []
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Cart:", cartItems);
    if (cartItems) {
      const count = cartItems?.reduce((acc, curr) => acc + curr?.quantity, 0);
      setCartCount(count);
    }
  }, [cartItems]);

  const HandleAddTCart = (prod, quantity = 1, size = null, color = null) => {
    if (!isAuthentified) {
      // Get existing cart or initialize
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
        toast.success("Existing items");
      } else {
        // Add a new product entry if it doesn't exist
        updatedCartItems = [
          ...storedCartItems,
          { ...prod, quantity, size, color },
        ];
        toast.success("Item Added to cart succesfully");
      }

      // Save updated cart in localStorage
      localStorage.setItem("CartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      console.log("Updated cart:", updatedCartItems);
    } else {
      console.log("User is authenticated - handle API cart instead");
    }
  };

  const HandleUpdateCartItem = (cartIndex, updates) => {
    if (!isAuthentified) {
      let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

      // Update the specific item
      storedCartItems[cartIndex] = {
        ...storedCartItems[cartIndex],
        ...updates,
      };

      // Save to localStorage and update state
      localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
      setCartItems(storedCartItems);
      console.log("Cart updated:", storedCartItems);
    } else {
      console.log("User is authenticated - handle cart update");
    }
  };

  const HandleRemoveFromCart = (cartIndex) => {
    if (!isAuthentified) {
      let storedCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

      // Remove item at the specified index
      storedCartItems.splice(cartIndex, 1);

      // Save to localStorage and update state
      localStorage.setItem("CartItems", JSON.stringify(storedCartItems));
      setCartItems(storedCartItems);
      console.log("Item removed. Updated cart:", storedCartItems);
    } else {
      console.log("User is authenticated - handle cart deletion");
    }
  };

  const HandleGetProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "GET",
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setProductData(data);
      } else {
        console.log("unable to fetch");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const HandleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const HandleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };
const HandleUpdateCart = async (prod) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));

        //checking if product exist

        const existingProduct = storedCartItems.find(
          (item) => parseInt(item?.id) === parseInt(prod?.id)
        );

        if (!existingProduct) {
          toast.error("Product does not exist in cart!");
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

        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
      } else {
        console.log("Authentified user");
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts,
        productData,
        HandleAddTCart,
        HandleUpdateCartItem,
        HandleRemoveFromCart,
        cartItems,
        cartCount,
        setIsAuthentified,
        isAuthenticated,
        user,
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

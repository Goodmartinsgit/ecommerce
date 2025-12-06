// import { useContext, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "../shared/Layout/Layout";
// import { Package, CreditCard, Lock, Loader2 } from "lucide-react";
// import ProductContext from "../context/NewProductContext";
// import { toast } from "react-toastify";
// import { baseUrl, flutterwavePublicKey } from "../config/config";
// import { addToCart as addToCartAPI } from "../Services/CartServices";

// const Checkout = () => {
//   const { cartItems, isAuthenticated, user, token } = useContext(ProductContext);
//   const navigate = useNavigate();
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   // Check authentication after component mounts and context initializes
//   useEffect(() => {
//     // Check both context state and localStorage for authentication
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     // Wait a brief moment for context to initialize from localStorage
//     const timer = setTimeout(() => {
//       setIsCheckingAuth(false);
//       // Only redirect if localStorage clearly indicates no authentication
//       // Don't rely solely on context state which may still be initializing
//       if (!token || !storedUser) {
//         toast.info("Please log in to proceed with checkout");
//         navigate("/login?returnUrl=/checkout");
//       }
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   // Calculate totals
//   const subtotal = useMemo(
//     () => cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0,
//     [cartItems]
//   );
//   const tax = useMemo(() => subtotal * 0.1, [subtotal]); // 10% tax
//   const shipping = 0; // Free shipping
//   const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);

//   // Show loading while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <Layout>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <Loader2 size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
//             <p className="text-gray-600">Loading checkout...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   // Redirect if cart is empty
//   if (!cartItems || cartItems.length === 0) {
//     return (
//       <Layout>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <Package size={64} className="mx-auto text-gray-400 mb-4" />
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
//             <p className="text-gray-600 mb-6">Add some products before checking out!</p>
//             <a
//               href="/"
//               className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-all"
//             >
//               Continue Shopping
//             </a>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

  

//   // Sync cart items to backend before payment
//   const syncCartToBackend = async () => {
//     const authToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (!authToken || !storedUser || !cartItems || cartItems.length === 0) {
//       console.warn('Cannot sync cart: missing auth or cart items');
//       return false;
//     }

//     try {
//       const userData = JSON.parse(storedUser);

//       // Sync each cart item to backend using the cart service
//       const syncPromises = cartItems.map(async (item) => {
//         try {
//           const response = await addToCartAPI(
//             userData.id,
//             item.id,
//             item.color || null,
//             item.size || null,
//             item.quantity || 1,
//             authToken
//           );

//           if (!response.ok) {
//             console.error(`Failed to sync item ${item.id}:`, response.data?.message || 'Unknown error');
//           }
//           return response.ok;
//         } catch (error) {
//           console.error(`Failed to sync item ${item.id}:`, error);
//           return false;
//         }
//       });

//       const results = await Promise.all(syncPromises);
//       const successCount = results.filter(r => r).length;

//       console.log(`Cart sync completed: ${successCount}/${cartItems.length} items synced`);
//       return successCount > 0; // Return true if at least one item synced successfully
//     } catch (error) {
//       console.error('Cart sync error:', error);
//       return false;
//     }
//   };

//   const handleInitializePayment = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const authToken = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');

//       if (!authToken) {
//         toast.error("Please login to continue");
//         navigate("/login?returnUrl=/checkout");
//         setIsLoading(false);
//         return;
//       }

//       if (!cartItems || cartItems.length === 0) {
//         toast.error("Your cart is empty");
//         setIsLoading(false);
//         return;
//       }

//       // Check if Flutterwave public key is configured
//       // if (!flutterwavePublicKey || flutterwavePublicKey === 'undefined') {
//       //   console.error('Flutterwave public key not configured:', flutterwavePublicKey);
//       //   toast.error("Payment service not configured. Please add VITE_FLUTTERWAVE_PUBLIC_KEY to your .env file and restart the server.");
//       //   setIsLoading(false);
//       //   return;
//       // }

//       console.log('Flutterwave key configured:', flutterwavePublicKey.substring(0, 20) + '...');

//       // Sync cart to backend before initializing payment
//       toast.info("Preparing your order...");
//       await syncCartToBackend();

//       const userData = storedUser ? JSON.parse(storedUser) : user;
//       const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//       // Configure Flutterwave payment
//       const paymentConfig = {
//         public_key: flutterwavePublicKey,
//         tx_ref: orderId,
//         amount: total,
//         currency: "NGN",
//         payment_options: "card,mobilemoney,ussd",
//         redirect_url: `${window.location.origin}/verify-payment`,
//         customer: {
//           email: userData?.email,
//           phone_number: userData?.phone || "",
//           name: `${userData?.firstname || ""} ${userData?.lastname || ""}`
//         },
//         customizations: {
//           title: "Grandeur Store",
//           description: "Payment for your order"
//         },
//         meta: {
//           userId: userData?.id,
//           orderId: orderId,
//           cartItems: JSON.stringify(cartItems)
//         },
//         callback: function(data) {
//           console.log("Payment callback:", data);
//           if (data.status === "successful") {
//             // Redirect to verification page
//             window.location.href = `/verify-payment?status=${data.status}&tx_ref=${data.tx_ref}&transaction_id=${data.transaction_id}`;
//           } else {
//             toast.error("Payment was not successful");
//             setIsLoading(false);
//           }
//         },
//         onclose: function() {
//           console.log("Payment modal closed");
//           setIsLoading(false);
//         }
//       };

//       // Initialize Flutterwave payment
//       if (window.FlutterwaveCheckout) {
//         window.FlutterwaveCheckout(paymentConfig);
//       } else {
//         toast.error("Payment service not loaded. Please refresh and try again.");
//         setIsLoading(false);
//       }

//     } catch (error) {
//       console.error("Payment initialization error:", error);
//       setIsLoading(false);
//       toast.error("Failed to initialize payment. Please try again.");
//     }
//   };


//   return (
//     <Layout>
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//             <p className="text-gray-600 mt-2">Complete your order</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left Column - Shipping & Payment Info */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Customer Information */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <Package size={24} />
//                   Customer Information
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600">Name</p>
//                     <p className="font-medium">{user?.firstname} {user?.lastname}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Email</p>
//                     <p className="font-medium">{user?.email}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Phone</p>
//                     <p className="font-medium">{user?.phone || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Address</p>
//                     <p className="font-medium">{user?.address || 'Not provided'}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => navigate('/dashboard?section=profile')}
//                   className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
//                 >
//                   Edit Information
//                 </button>
//               </div>

//               {/* Order Items */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-semibold mb-4">Order Items ({cartItems.length})</h2>
//                 <div className="space-y-4">
//                   {cartItems.map((item, index) => (
//                     <div
//                       key={`${item.id}-${item.size}-${item.color}-${index}`}
//                       className="flex gap-4 pb-4 border-b last:border-b-0"
//                     >
//                       <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
//                         <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
//                           {item.size && <span>Size: {item.size}</span>}
//                           {item.color && (
//                             <span className="flex items-center gap-1">
//                               Color:
//                               <span
//                                 className="w-4 h-4 rounded-full border border-gray-300 inline-block"
//                                 style={{ backgroundColor: item.color }}
//                               />
//                             </span>
//                           )}
//                           <span>Qty: {item.quantity}</span>
//                         </div>
//                         <p className="text-lg font-bold text-green-700 mt-1">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Payment Method */}
//               {/* <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <CreditCard size={24} />
//                   Payment Method
//                 </h2>
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="card"
//                       defaultChecked
//                       className="w-4 h-4 accent-black"
//                     />
//                     <CreditCard size={20} />
//                     <span className="font-medium">Credit/Debit Card</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="paypal"
//                       className="w-4 h-4 accent-black"
//                     />
//                     <span className="font-medium">Flutterwave</span>
//                   </label>
//                   <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="cash"
//                       className="w-4 h-4 accent-black"
//                     />
//                     <span className="font-medium">Cash on Delivery</span>
//                   </label>
//                 </div>
//               </div> */}
//             </div>

//             {/* Right Column - Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
//                 <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//                 <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
//                   <div className="flex justify-between text-gray-700">
//                     <span>Subtotal ({cartItems.length} items)</span>
//                     <span className="font-medium">${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-700">
//                     <span>Tax (10%)</span>
//                     <span className="font-medium">${tax.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-700">
//                     <span>Shipping</span>
//                     <span className="font-medium text-green-600">FREE</span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between text-xl font-bold mb-6 text-gray-900">
//                   <span>Total</span>
//                   <span className="text-green-700">${total.toFixed(2)}</span>
//                 </div>

//                 <button
//                   onClick={handleInitializePayment}
//                   disabled={isLoading}
//                   className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <Loader2 size={20} className="animate-spin" />
//                   ) : (
//                     <Lock size={20} />
//                   )}
//                   {isLoading ? 'Proceeding to payment...' : 'Place Order'}
//                 </button>

//                 <button
//                   onClick={() => navigate('/cart')}
//                   className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
//                 >
//                   ← Back to Cart
//                 </button>

//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Lock size={16} />
//                     <span>Secure SSL encrypted checkout</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Checkout;









// Improved payment initialization with better error handling and validation
const handleInitializePayment = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 1. Validate authentication
    const authToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!authToken || !storedUser) {
      toast.error("Please login to continue");
      navigate("/login?returnUrl=/checkout");
      return;
    }

    // 2. Validate cart
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // 3. Validate Flutterwave configuration
    if (!flutterwavePublicKey || flutterwavePublicKey === 'undefined') {
      console.error('Flutterwave public key not configured');
      toast.error("Payment service not configured. Please contact support.");
      return;
    }

    // 4. Sync cart to backend
    toast.info("Preparing your order...");
    const syncSuccess = await syncCartToBackend();
    
    if (!syncSuccess) {
      toast.error("Failed to prepare order. Please try again.");
      return;
    }

    // 5. Generate unique order reference
    const userData = JSON.parse(storedUser);
    const orderId = `ORDER_${Date.now()}_${userData.id}_${Math.random().toString(36).substr(2, 9)}`;

    // 6. Prepare order summary (not full cart data)
    const orderSummary = {
      itemCount: cartItems.length,
      subtotal: subtotal,
      tax: tax,
      total: total,
      timestamp: new Date().toISOString()
    };

    // 7. Configure Flutterwave payment
    const paymentConfig = {
      public_key: flutterwavePublicKey,
      tx_ref: orderId,
      amount: Math.round(total * 100) / 100, // Ensure 2 decimal places
      currency: "NGN",
      payment_options: "card,mobilemoney,ussd",
      redirect_url: `${window.location.origin}/verify-payment`,
      customer: {
        email: userData.email,
        phone_number: userData.phone || "",
        name: `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
      },
      customizations: {
        title: "Grandeur Store",
        description: `Order for ${cartItems.length} item(s)`,
        logo: `${window.location.origin}/logo.png` // Add your logo URL
      },
      meta: {
        userId: userData.id,
        orderId: orderId,
        itemCount: cartItems.length,
        // Store order summary, not full cart
        orderSummary: JSON.stringify(orderSummary)
      },
      callback: function(response) {
        console.log("Payment callback:", response);
        
        // Handle successful payment
        if (response.status === "successful") {
          toast.success("Payment successful! Verifying order...");
          window.location.href = `/verify-payment?status=${response.status}&tx_ref=${response.tx_ref}&transaction_id=${response.transaction_id}`;
        } else if (response.status === "cancelled") {
          toast.info("Payment cancelled");
          setIsLoading(false);
        } else {
          toast.error("Payment failed. Please try again.");
          setIsLoading(false);
        }
      },
      onclose: function() {
        console.log("Payment modal closed");
        toast.info("Payment window closed");
        setIsLoading(false);
      }
    };

    // 8. Initialize Flutterwave payment
    if (typeof window.FlutterwaveCheckout === 'function') {
      window.FlutterwaveCheckout(paymentConfig);
    } else {
      throw new Error("Payment service not loaded");
    }

  } catch (error) {
    console.error("Payment initialization error:", error);
    toast.error(error.message || "Failed to initialize payment. Please try again.");
  } finally {
    // Only reset loading if payment modal didn't open
    setTimeout(() => setIsLoading(false), 1000);
  }
};

// Improved cart sync with better error handling
const syncCartToBackend = async () => {
  const authToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!authToken || !storedUser || !cartItems || cartItems.length === 0) {
    console.error('Cannot sync cart: missing required data');
    return false;
  }

  try {
    const userData = JSON.parse(storedUser);
    const syncResults = [];

    // Sync items sequentially to avoid rate limiting
    for (const item of cartItems) {
      try {
        const response = await addToCartAPI(
          userData.id,
          item.id,
          item.color || null,
          item.size || null,
          item.quantity || 1,
          authToken
        );

        syncResults.push({
          itemId: item.id,
          success: response.ok,
          error: response.ok ? null : response.data?.message
        });

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        syncResults.push({
          itemId: item.id,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = syncResults.filter(r => r.success).length;
    console.log(`Cart sync: ${successCount}/${cartItems.length} items synced`);

    // Log failed items
    const failedItems = syncResults.filter(r => !r.success);
    if (failedItems.length > 0) {
      console.warn('Failed to sync items:', failedItems);
    }

    // Require at least 80% success rate
    return successCount >= cartItems.length * 0.8;
  } catch (error) {
    console.error('Cart sync error:', error);
    return false;
  }
};

// Add validation before checkout
const validateCheckout = () => {
  const errors = [];

  // Validate user data
  if (!user?.email) errors.push("Email is required");
  if (!user?.phone) errors.push("Phone number is required");
  if (!user?.address) errors.push("Delivery address is required");

  // Validate cart
  if (!cartItems || cartItems.length === 0) {
    errors.push("Cart is empty");
  }

  // Check for zero or negative prices
  const invalidItems = cartItems.filter(item => !item.price || item.price <= 0);
  if (invalidItems.length > 0) {
    errors.push("Some items have invalid prices");
  }

  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return false;
  }

  return true;
};
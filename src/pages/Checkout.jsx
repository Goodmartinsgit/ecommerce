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








// OPTION 1: Fetch Payment Key from Backend API
// This is the MOST SECURE approach - recommended for production

// Create a new service file: Services/PaymentServices.js
export const getPaymentConfig = async (token) => {
  try {
    const response = await fetch(`${baseUrl}/api/payment/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment configuration');
    }
    
    const data = await response.json();
    return {
      publicKey: data.flutterwavePublicKey,
      currency: data.currency || 'NGN'
    };
  } catch (error) {
    console.error('Error fetching payment config:', error);
    throw error;
  }
};

// Updated Checkout Component with Backend API
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import { Package, CreditCard, Lock, Loader2 } from "lucide-react";
import ProductContext from "../context/NewProductContext";
import { toast } from "react-toastify";
import { baseUrl } from "../config/config";
import { addToCart as addToCartAPI } from "../Services/CartServices";
import { getPaymentConfig } from "../Services/PaymentServices";

const Checkout = () => {
  const { cartItems, isAuthenticated, user, token } = useContext(ProductContext);
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // Fetch payment configuration on mount
  // In your Checkout component, update the useEffect:
useEffect(() => {
  const fetchPaymentConfig = async () => {
    try {
      const authToken = localStorage.getItem('token');
      console.log('Auth token exists:', !!authToken); // Debug
      
      if (authToken) {
        const config = await getPaymentConfig(authToken);
        console.log('Payment config received:', config); // Debug
        console.log('Public key:', config.publicKey); // Debug
        setPaymentConfig(config);
      } else {
        console.error('No auth token found');
      }
    } catch (error) {
      console.error('Failed to load payment configuration:', error);
      toast.error('Failed to load payment settings');
    }
  };

  fetchPaymentConfig();
}, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
      if (!token || !storedUser) {
        toast.info("Please log in to proceed with checkout");
        navigate("/login?returnUrl=/checkout");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Calculate totals
  const subtotal = useMemo(
    () => cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0,
    [cartItems]
  );
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const shipping = 0;
  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);

  // Sync cart to backend
  const syncCartToBackend = async () => {
    const authToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!authToken || !storedUser || !cartItems || cartItems.length === 0) {
      return false;
    }

    try {
      const userData = JSON.parse(storedUser);
      const syncPromises = cartItems.map(async (item) => {
        try {
          const response = await addToCartAPI(
            userData.id,
            item.id,
            item.color || null,
            item.size || null,
            item.quantity || 1,
            authToken
          );
          return response.ok;
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          return false;
        }
      });

      const results = await Promise.all(syncPromises);
      return results.filter(r => r).length > 0;
    } catch (error) {
      console.error('Cart sync error:', error);
      return false;
    }
  };

  // Initialize payment with backend key
  // const handleInitializePayment = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const authToken = localStorage.getItem('token');
  //     const storedUser = localStorage.getItem('user');

  //     if (!authToken || !storedUser) {
  //       toast.error("Please login to continue");
  //       navigate("/login?returnUrl=/checkout");
  //       return;
  //     }

  //     if (!cartItems || cartItems.length === 0) {
  //       toast.error("Your cart is empty");
  //       return;
  //     }

  //     // Check if payment config is loaded
  //     if (!paymentConfig || !paymentConfig.publicKey) {
  //       toast.error("Payment configuration not available. Please refresh the page.");
  //       return;
  //     }

  //     const flutterwaveKey = paymentConfig.publicKey.trim();
      
  //     if (!flutterwaveKey.startsWith('FLWPUBK-')) {
  //       console.error('Invalid public key format');
  //       toast.error("Invalid payment configuration. Please contact support.");
  //       return;
  //     }

  //     toast.info("Preparing your order...");
  //     await syncCartToBackend();

  //     const userData = JSON.parse(storedUser);
  //     const orderId = `ORD_${Date.now()}_${userData.id}`;

  //     const config = {
  //       public_key: flutterwaveKey,
  //       tx_ref: orderId,
  //       amount: Number(total.toFixed(2)),
  //       currency: paymentConfig.currency || "NGN",
  //       country: "NG",
  //       payment_options: "card,mobilemoney,ussd,account",
  //       customer: {
  //         email: userData.email,
  //         phone_number: userData.phone || "",
  //         name: `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
  //       },
  //       customizations: {
  //         title: "Grandeur Store",
  //         description: `Payment for ${cartItems.length} item(s)`,
  //         logo: ""
  //       },
  //       meta: {
  //         consumer_id: userData.id,
  //         order_id: orderId
  //       },
  //       callback: function(response) {
  //         if (response.status === "successful") {
  //           toast.success("Payment successful!");
  //           window.location.href = `/verify-payment?status=successful&tx_ref=${response.tx_ref}&transaction_id=${response.transaction_id}`;
  //         } else {
  //           toast.error("Payment was not successful");
  //           setIsLoading(false);
  //         }
  //       },
  //       onclose: function() {
  //         setIsLoading(false);
  //       }
  //     };

  //     if (typeof window.FlutterwaveCheckout === 'function') {
  //       window.FlutterwaveCheckout(config);
  //     } else {
  //       toast.error("Payment service not loaded. Please refresh and try again.");
  //       setIsLoading(false);
  //     }

  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     toast.error("Failed to initialize payment");
  //     setIsLoading(false);
  //   }
  // };

  const handleInitializePayment = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const authToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!authToken || !storedUser) {
      toast.error("Please login to continue");
      navigate("/login?returnUrl=/checkout");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // DETAILED DEBUGGING
    console.log('Payment config state:', paymentConfig);
    console.log('Public key from config:', paymentConfig?.publicKey);

    if (!paymentConfig) {
      console.error('Payment config is null/undefined');
      toast.error("Payment configuration not loaded. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    if (!paymentConfig.publicKey) {
      console.error('Public key is missing from config');
      toast.error("Payment key not available. Please contact support.");
      setIsLoading(false);
      return;
    }

    const flutterwaveKey = paymentConfig.publicKey.trim();
    
    console.log('Flutterwave key to use:', flutterwaveKey);
    console.log('Key starts with FLWPUBK-?', flutterwaveKey.startsWith('FLWPUBK-'));
    
    if (!flutterwaveKey.startsWith('FLWPUBK-')) {
      console.error('Invalid public key format:', flutterwaveKey);
      toast.error("Invalid payment configuration. Please contact support.");
      setIsLoading(false);
      return;
    }

    // Rest of your payment code...
    toast.info("Preparing your order...");
    await syncCartToBackend();

    const userData = JSON.parse(storedUser);
    const orderId = `ORD_${Date.now()}_${userData.id}`;

    const config = {
      public_key: flutterwaveKey,
      tx_ref: orderId,
      amount: Number(total.toFixed(2)),
      currency: paymentConfig.currency || "NGN",
      // ... rest of config
    };

    console.log('Flutterwave config:', config);

    if (typeof window.FlutterwaveCheckout === 'function') {
      window.FlutterwaveCheckout(config);
    } else {
      toast.error("Payment service not loaded. Please refresh and try again.");
      setIsLoading(false);
    }

  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Failed to initialize payment");
    setIsLoading(false);
  }
};

  // Show loading states...
  if (isCheckingAuth) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <a href="/" className="inline-block bg-black text-white px-6 py-3 rounded-md">
              Continue Shopping
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package size={24} />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{user?.firstname} {user?.lastname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items ({cartItems.length})</h2>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-lg font-bold text-green-700">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span className="text-green-700">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleInitializePayment}
                  disabled={isLoading || !paymentConfig}
                  className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-all font-semibold flex items-center justify-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Place Order
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
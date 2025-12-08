import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import { Package, Lock, Loader2 } from "lucide-react";
import ProductContext from "../context/NewProductContext";
import { toast } from "react-toastify";
import { addToCart as addToCartAPI } from "../Services/CartServices";
import { getPaymentConfig } from "../Services/PaymentServices";

const Checkout = () => {
  const { cartItems, user } = useContext(ProductContext);
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);

  // Fetch payment configuration on mount
  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        const authToken = localStorage.getItem('token');
        
        if (authToken) {
          const config = await getPaymentConfig(authToken);
          setPaymentConfig(config);
        } else {
          // No auth token, will be handled by auth check
        }
      } catch (error) {
        console.error('Failed to load payment configuration');
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
          return false;
        }
      });

      const results = await Promise.all(syncPromises);
      return results.filter(r => r).length > 0;
    } catch (error) {
      return false;
    }
  };

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

      if (!paymentConfig) {
        toast.error("Payment configuration not loaded. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      if (!paymentConfig.publicKey) {
        toast.error("Payment key not available. Please contact support.");
        setIsLoading(false);
        return;
      }

      const flutterwaveKey = paymentConfig.publicKey.trim();
      
      if (!flutterwaveKey.startsWith('FLWPUBK-') && !flutterwaveKey.startsWith('FLWPUBK_TEST-')) {
        console.error('Invalid public key format'); // Keep this error for debugging config issues
        toast.error("Invalid payment configuration. Please contact support.");
        setIsLoading(false);
        return;
      }

      toast.info("Preparing your order...");
      await syncCartToBackend();

      const userData = JSON.parse(storedUser);
      const orderId = `ORD_${Date.now()}_${userData.id}`;

      const config = {
        public_key: flutterwaveKey,
        tx_ref: orderId,
        amount: Number(total.toFixed(2)),
        currency: paymentConfig.currency || "NGN",
        country: "NG",
        payment_options: "card,mobilemoney,ussd,account",
        customer: {
          email: userData.email,
          phone_number: userData.phone || "",
          name: `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
        },
        customizations: {
          title: "Grandeur Store",
          description: `Payment for ${cartItems.length} item(s)`,
          logo: "" // Empty string as recommended to fix logo 404
        },
        meta: {
          consumer_id: userData.id,
          order_id: orderId,
          // Removed cartItems from meta to avoid hitting payload limits
        },
        callback: function(response) {
          if (response.status === "successful") {
            toast.success("Payment successful!");
            window.location.href = `/verify-payment?status=successful&tx_ref=${response.tx_ref}&transaction_id=${response.transaction_id}`;
          } else {
            toast.error("Payment was not successful");
            setIsLoading(false);
          }
        },
        onclose: function() {
          setIsLoading(false);
        }
      };

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

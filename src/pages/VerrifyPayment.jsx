import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaReceipt, FaArrowLeft } from "react-icons/fa";
import Confetti from "react-confetti";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { baseUrl } from "../config/config";
import ProductContext from "../context/NewProductContext";

// Print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-area, .print-area * {
      visibility: visible;
    }
    .print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
  }
`;

export default function VerifyPayment() {
  const [searchParams] = useSearchParams();
  const { setCartItems } = useContext(ProductContext);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showReceipt, setShowReceipt] = useState(false); // New state to toggle receipt view

  const transaction_id = searchParams.get("transaction_id");
  const status = searchParams.get("status");
  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleVerifyPayment = async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        toast.error("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${baseUrl}/payment/verify?transaction_id=${transaction_id}&status=${status}&tx_ref=${txRef}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Payment verification successful:", data);
        setIsVerified(true);
        setReceiptData(data?.data);

        localStorage.removeItem("CartItems");
        setCartItems([]);

        toast.success("Payment verified successfully!");
      } else {
        toast.error(data?.message || "Payment verification failed");
        console.error("Verification failed:", data);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Failed to verify payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transaction_id && status) {
      console.log("Starting payment verification:", { transaction_id, status, txRef });
      handleVerifyPayment();
    } else {
      console.error("Missing required parameters for payment verification");
      toast.error("Invalid payment verification link");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction_id, status]);

  // Loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <PulseLoader color="#000000" size={15} />
          <p className="text-2xl font-semibold text-black">Verifying Payment...</p>
          <p className="text-sm text-gray-500">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!isVerified && !isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-red-200 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 text-red-600 w-20 h-20 flex items-center justify-center rounded-full">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-red-600">
            Verification Failed
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            We couldn't verify your payment. Please contact support if the amount was deducted.
          </p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-sm"
          >
            Return to Home
          </motion.a>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white text-black px-4 py-8">
      {!showReceipt && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          numberOfPieces={150} 
          recycle={false}
        />
      )}

      <AnimatePresence mode="wait">
        {!showReceipt ? (
          // Success Modal
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-gray-200 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="flex justify-center"
            >
              <div className="bg-green-500 text-white w-20 h-20 flex items-center justify-center rounded-full shadow-lg mb-6">
                <FaCheckCircle className="w-10 h-10" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mb-6 text-lg">
              Your payment has been confirmed. Thank you for shopping with us!
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-100 p-5 rounded-2xl shadow-inner text-left mb-6"
            >
              {status && (
                <p className="mb-2">
                  <strong>Status:</strong> {status}
                </p>
              )}
              {txRef && (
                <p className="mb-2">
                  <strong>Transaction Ref:</strong> {txRef}
                </p>
              )}
              {transaction_id && (
                <p>
                  <strong>Transaction ID:</strong> {transaction_id}
                </p>
              )}
            </motion.div>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReceipt(true)}
                className="px-6 py-3 rounded-xl border border-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                <FaReceipt /> View Receipt
              </motion.button>

              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 shadow-sm"
              >
                Continue Shopping
              </motion.a>
            </div>
          </motion.div>
        ) : (
          // Receipt View
          <motion.div
            key="receipt"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-8 rounded-3xl shadow-xl max-w-4xl w-full border border-gray-200 print-area"
          >
            <style>{printStyles}</style>
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReceipt(false)}
              className="mb-6 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 no-print"
            >
              <FaArrowLeft /> Back to Summary
            </motion.button>

            {/* Receipt Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500 text-white w-16 h-16 flex items-center justify-center rounded-full">
                  <FaReceipt className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl font-bold font-serif italic mb-2 text-black">Granduer</h1>
              <p className="text-sm text-gray-500 mb-4">Fashion & Style Store</p>
              <h2 className="text-2xl font-bold mb-2">Payment Receipt</h2>
              <p className="text-gray-600">Transaction ID: {transaction_id}</p>
              <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}</p>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-100 p-5 rounded-2xl mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">{status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction Ref</p>
                  <p className="font-semibold">{txRef}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{receiptData?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{receiptData?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Receipt Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-left font-semibold">S/N</th>
                    <th className="p-3 text-left font-semibold">Image</th>
                    <th className="p-3 text-left font-semibold">Name</th>
                    <th className="p-3 text-right font-semibold">Price</th>
                    <th className="p-3 text-center font-semibold">Quantity</th>
                    <th className="p-3 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData?.receiptItems?.map((item, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">
                        <img
                          className="w-12 h-12 object-cover rounded"
                          src={item?.image}
                          alt={item?.name}
                        />
                      </td>
                      <td className="p-3">{item?.name}</td>
                      <td className="p-3 text-right">₦{item?.price?.toLocaleString()}</td>
                      <td className="p-3 text-center">{item?.quantity}</td>
                      <td className="p-3 text-right font-semibold">₦{item?.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            {receiptData?.receiptItems && (
              <div className="bg-green-50 border border-green-200 p-5 rounded-2xl mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-700">Total Amount:</span>
                  <span className="text-2xl font-extrabold text-green-600">
                    ₦{receiptData.receiptItems.reduce((sum, item) => sum + (item?.total || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 no-print">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 rounded-xl border border-black hover:bg-black hover:text-white transition-all duration-300"
              >
                Print Receipt
              </motion.button>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 rounded-xl bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 text-center"
              >
                Continue Shopping
              </motion.a>
            </div>
            
            {/* Print Footer */}
            <div className="hidden print:block mt-8 text-center text-sm text-gray-500">
              <p>Thank you for shopping with DESOBER!</p>
              <p>Visit us at www.desober.com | Email: support@desober.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



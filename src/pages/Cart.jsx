import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import { Trash2, Plus, Minus } from "lucide-react";
import ProductContext from "../context/NewProductContext";

const Cart = () => {
  const { cartItems, HandleUpdateCartItem, HandleRemoveFromCart } = useContext(ProductContext);
  const navigate = useNavigate();

  const [editingItem, setEditingItem] = useState(null);
  const [tempSize, setTempSize] = useState("");
  const [tempColor, setTempColor] = useState("");

  // Calculate totals with useMemo for performance
  const subtotal = useMemo(
    () => cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0,
    [cartItems]
  );
  const tax = useMemo(() => subtotal * 0.1, [subtotal]); // 10% tax
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleQuantityChange = (cartIndex, newQuantity) => {
    if (newQuantity < 1) return;
    HandleUpdateCartItem(cartIndex, { quantity: newQuantity });
  };

  const handleStartEdit = (cartIndex, item) => {
    setEditingItem(cartIndex);
    setTempSize(item.size);
    setTempColor(item.color);
  };

  const handleSaveEdit = (cartIndex) => {
    HandleUpdateCartItem(cartIndex, {
      size: tempSize,
      color: tempColor
    });
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setTempSize("");
    setTempColor("");
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <a
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-all"
            >
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category?.name || ''}</p>
                        </div>
                        <button
                          onClick={() => HandleRemoveFromCart(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-lg sm:text-xl font-bold text-green-700 mb-4">
                        ${item.price}
                        {item.discount > 0 && (
                          <span className="text-sm text-red-500 ml-2">
                            ({item.discount}% off)
                          </span>
                        )}
                      </p>

                      {/* Size & Color Display/Edit */}
                      {editingItem === index ? (
                        <div className="space-y-3 mb-4">
                          {/* Edit Size */}
                          {item.sizes && item.sizes.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Size:
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {item.sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setTempSize(size)}
                                    className={`border rounded-md px-3 py-1 text-sm transition-all ${
                                      tempSize === size
                                        ? "bg-black text-white border-black"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Edit Color */}
                          {item.colors && item.colors.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Color:
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {item.colors.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => setTempColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                      tempColor === color
                                        ? "border-black scale-110"
                                        : "border-gray-300 hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Save/Cancel Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                          {item.size && (
                            <span className="text-sm">
                              <span className="font-medium text-gray-700">Size:</span>{" "}
                              <span className="bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                            </span>
                          )}
                          {item.color && (
                            <span className="text-sm flex items-center gap-2">
                              <span className="font-medium text-gray-700">Color:</span>
                              <span
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: item.color }}
                                title={item.color}
                              />
                            </span>
                          )}
                          <button
                            onClick={() => handleStartEdit(index, item)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                              className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                  handleQuantityChange(index, value);
                                }
                              }}
                              className="w-12 sm:w-16 text-center outline-none px-2 py-1.5"
                            />
                            <button
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                              className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className="text-sm text-gray-600">Item Total</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-28">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-green-700">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all font-medium mb-3"
                >
                  Proceed to Checkout
                </button>

                <a
                  href="/"
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;






import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Plus, Minus, Sparkles } from "lucide-react";
import Layout from "../shared/Layout/Layout";
import { IoBagAddOutline } from "react-icons/io5";
import ProductContext from "../context/NewProductContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProductImage, handleImageError } from "../utils/imageHelper";

const NewArrival = () => {
  const {
    HandleGetProducts,
    productData,
    isLoadingProducts,
    HandleAddToCart,
    HandleUpdateCartItem,
    HandleRemoveFromCart,
    cartItems,
  } = useContext(ProductContext);
  const [newArrivals, setNewArrivals] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    if (!productData || productData.length === 0) {
      HandleGetProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productData && productData.length > 0) {
      // Filter products marked as new arrivals
      const arrivals = productData.filter((item) => item?.newArrival === true);
      setNewArrivals(arrivals);
    }
  }, [productData]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const getCartItemIndex = (productId, size, color) => {
    if (!cartItems) return -1;
    return cartItems.findIndex(
      (item) =>
        parseInt(item.id) === parseInt(productId) &&
        item.size === size &&
        item.color === color
    );
  };

  const getCartQuantity = (productId, size, color) => {
    const index = getCartItemIndex(productId, size, color);
    return index !== -1 ? cartItems[index].quantity : 0;
  };

  const handleAddToCart = (product) => {
    HandleAddToCart(
      product,
      1,
      product.defaultSize || "",
      product.defaultColor || ""
    );
  };

  const handleIncreaseQuantity = (productId, size, color) => {
    const index = getCartItemIndex(productId, size, color);
    if (index !== -1) {
      const currentQuantity = cartItems[index].quantity;
      HandleUpdateCartItem(index, { quantity: currentQuantity + 1 });
    }
  };

  const handleDecreaseQuantity = (productId, size, color) => {
    const index = getCartItemIndex(productId, size, color);
    if (index !== -1) {
      const currentQuantity = cartItems[index].quantity;
      if (currentQuantity > 1) {
        HandleUpdateCartItem(index, { quantity: currentQuantity - 1 });
      } else {
        HandleRemoveFromCart(index);
      }
    }
  };

  if (isLoadingProducts) {
    return (
      <Layout>
        <LoadingSpinner fullScreen={true} size="lg" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with sparkle icon */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <h1 className="text-primary text-3xl font-bold mt-2">
                New Arrivals
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-primary mt-2 text-lg">
              Check out our latest collection of trendy items
            </p>
          </div>

          {newArrivals.length === 0 ? (
            <div className="text-center mt-16 py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-lg mb-2">No new arrivals yet.</p>
              <p className="text-gray-500 text-sm mb-6">
                Check back soon for our latest products!
              </p>
              <Link
                to="/"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mt-4">
                Showing {newArrivals.length} new product
                {newArrivals.length !== 1 ? "s" : ""}
              </p>

              {/* Product Grid - 4 columns */}
              <div className="px-4 md:px-10 lg:px-0 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 md:gap-y-12 gap-8 justify-center items-stretch lg:mt-6 mt-8">
                {newArrivals.map((product) => {
                  const cartQuantity = getCartQuantity(
                    product.id,
                    product.defaultSize || "",
                    product.defaultColor || ""
                  );
                  const isInCart = cartQuantity > 0;

                  return (
                    <div
                      key={product.id}
                      className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden relative"
                    >
                      {/* New Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          NEW
                        </span>
                      </div>

                      <div className="w-full h-[20rem] overflow-hidden">
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full h-full"
                        >
                          <img
                            src={getProductImage(product.image)}
                            alt={product.name}
                            onError={handleImageError}
                            className="object-cover w-full bg-gray-500 h-full hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                      </div>

                      <div className="p-2">
                        <p className="text-black font-bold mt-2">
                          {product.name}
                        </p>
                        <p className="text-black mt-2 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex justify-between items-center mt-2">
                          <span className="p-2 bg-primary text-white rounded-md">
                            ₦{product.price}
                          </span>

                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer transition"
                          >
                            {favorites[product.id] ? (
                              <FaHeart className="h-6 w-6 text-red-500" />
                            ) : (
                              <CiHeart className="h-6 w-6" />
                            )}
                          </button>
                        </div>

                        {/* Cart Controls */}
                        <div className="mt-3">
                          {!isInCart ? (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition flex items-center justify-center gap-2"
                            >
                              <IoBagAddOutline className="h-5 w-5 " />
                              Pick this
                            </button>
                          ) : (
                            <div className="flex items-center justify-between border-2 border-green-600 rounded-md bg-green-50">
                              <button
                                onClick={() =>
                                  handleDecreaseQuantity(
                                    product.id,
                                    product.defaultSize || "",
                                    product.defaultColor || ""
                                  )
                                }
                                className="px-3 py-2 hover:bg-green-100 transition text-green-700"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="font-semibold text-green-700">
                                {cartQuantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleIncreaseQuantity(
                                    product.id,
                                    product.defaultSize || "",
                                    product.defaultColor || ""
                                  )
                                }
                                className="px-3 py-2 hover:bg-green-100 transition text-green-700"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Back to Home Button */}
              <div className="flex justify-center mt-8 mb-8">
                <Link
                  to="/"
                  className="rounded-md bg-white text-black border-2 border-primary cursor-pointer px-6 py-2 hover:bg-primary hover:text-white transition"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewArrival;

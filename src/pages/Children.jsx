import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Plus, Minus, ShoppingCart } from "lucide-react";
// import { ProductContext } from "../Context/ProductContext";
import Layout from "../shared/Layout/Layout";
import { IoBagAddOutline } from "react-icons/io5";
import ProductContext from "../context/ProductContext";
// import { ProductContext } from "../context/ProductContext";

const Children = () => {
  const {
    HandleGetProducts,
    productData,
    HandleAddTCart,
    HandleUpdateCartItem,
    HandleRemoveFromCart,
    cartItems,
  } = useContext(ProductContext);
  const [childrensCloth, setChildrensCloth] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    HandleGetProducts();
  }, []);

  useEffect(() => {
    if (productData && productData.length > 0) {
      const childClothc = productData.filter((item) => item.category ===  "children");
      setChildrensCloth(childClothc);
    }
  }, [productData]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };
  

  const getCartItemIndex = (productId) => {
    if (!cartItems) return -1;
    return cartItems.findIndex(
      (item) => parseInt(item.id) === parseInt(productId)
    );
  };

  const getCartQuantity = (productId) => {
    const index = getCartItemIndex(productId);
    return index !== -1 ? cartItems[index].quantity : 0;
  };

  const handleAddToCart = (product) => {
    HandleAddTCart(
      product,
      1,
      product.defaultSize || "",
      product.defaultColor || ""
    );
  };

  const handleIncreaseQuantity = (productId) => {
    const index = getCartItemIndex(productId);
    if (index !== -1) {
      const currentQuantity = cartItems[index].quantity;
      HandleUpdateCartItem(index, { quantity: currentQuantity + 1 });
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const index = getCartItemIndex(productId);
    if (index !== -1) {
      const currentQuantity = cartItems[index].quantity;
      if (currentQuantity > 1) {
        HandleUpdateCartItem(index, { quantity: currentQuantity - 1 });
      } else {
        HandleRemoveFromCart(index);
      }
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen py-8">
      
        {/* DYNAMIC ADD TO CART BUTTON */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-primary text-3xl font-bold mt-8">
            All Childrens Cloth
          </h1>
          <p className="text-center text-primary mt-2 text-lg">
            Explore our complete collection of childrens cloth.
          </p>

          {childrensCloth.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-gray-600 text-lg">No childrens cloth found.</p>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mt-4">
                Showing {childrensCloth.length} product
                {childrensCloth.length !== 1 ? "s" : ""}
              </p>

              {/* Product Grid - 4 columns */}
              <div className="px-4 md:px-10 lg:px-0 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 md:gap-y-12 gap-8 justify-center items-stretch lg:mt-6 mt-8">
                {childrensCloth.map((product) => {
                  const cartQuantity = getCartQuantity(product.id);
                  const isInCart = cartQuantity > 0;

                  return (
                    <div
                      key={product.id}
                      className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden"
                    >
                      <div className="w-full h-[20rem] overflow-hidden">
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full h-full"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full bg-gray-500 h-full"
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
                              {/* <ShoppingCart size={18} /> */}
                              <IoBagAddOutline className="h-5 w-5 " />
                              Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center justify-between border-2 border-green-600 rounded-md bg-green-50">
                              <button
                                onClick={() =>
                                  handleDecreaseQuantity(product.id)
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
                                  handleIncreaseQuantity(product.id)
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

export default Children;

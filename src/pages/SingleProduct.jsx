import { useContext, useEffect, useState } from "react";
// import { ProductContext } from "../Context/ProductContext";
import { useParams } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import ProductContext from "../context/ProductContext";
// import { ProductContext } from "../context/ProductContext";

const SingleProduct = () => {
  const { id } = useParams();
  const { productData, HandleGetProducts, HandleAddTCart, cartItems } =
    useContext(ProductContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);

  useEffect(() => {
    if (!productData?.length > 0) {
      HandleGetProducts();
    }
  }, [HandleGetProducts, productData]);

  useEffect(() => {
    if (productData?.length > 0) {
      const found = productData.find(
        (item) => parseInt(item.id) === parseInt(id)
      );
      setProduct(found);
      setSelectedColor(found?.defaultColor || "");
      setSelectedSize(found?.defaultSize || "");
    }
  }, [productData, id]);

  // Check if product is in cart and get current quantity
  useEffect(() => {
    if (product && cartItems) {
      const cartItem = cartItems.find(
        (item) =>
          parseInt(item.id) === parseInt(product.id) &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (cartItem) {
        setIsInCart(true);
        setCurrentCartQuantity(cartItems.quantity || 0);
      } else {
        setIsInCart(false);
        setCurrentCartQuantity(0);
      }
    }
  }, [cartItems, product, selectedSize, selectedColor]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    HandleAddTCart(product, quantity, selectedSize, selectedColor);
  };

  if (!product) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading product...</p>
    );
  }

  const totalQuantity = currentCartQuantity + quantity;

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="flex gap-4">
              <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-3">{product.description}</p>

              <div className="mb-4">
                <p className="text-xl font-semibold text-green-700">
                  ${product.price}{" "}
                  {product.discount > 0 && (
                    <span className="text-sm text-red-500 ml-2">
                      ({product.discount}% off)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 uppercase mt-1">
                  Category: {product.category} → {product.subcategory}
                </p>
              </div>

              {/* Sizes */}
              {product?.sizes && product?.sizes.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Size:</h2>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border rounded-md px-3 py-1 text-sm cursor-pointer transition-all
                      ${
                        selectedSize === size
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

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Color:</h2>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all
                      ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cart Status Alert */}
              {isInCart && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ This item is already in your cart (Quantity:{" "}
                    {currentCartQuantity})
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <h2 className="font-semibold mb-2">
                  {isInCart ? "Add More Quantity:" : "Quantity:"}
                </h2>
                <div className="flex items-center border rounded-md w-fit">
                  <button
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) setQuantity(value);
                    }}
                    className="w-16 text-center outline-none px-2 py-1"
                  />

                  <button
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quantity Summary - Only show when item is in cart */}
              {isInCart && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Quantity Summary:
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current in cart:</span>
                      <span className="font-medium">{currentCartQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adding:</span>
                      <span className="font-medium text-blue-600">
                        +{quantity}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="font-semibold text-gray-800">
                        Total quantity:
                      </span>
                      <span className="font-bold text-lg text-green-600">
                        {totalQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart / Add More Quantity Button */}
              {!isInCart ? (
                <button
                  onClick={handleAddToCart}
                  className="mt-4 w-full py-3 rounded-md transition-all font-medium bg-black hover:bg-gray-800 text-white"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="mt-4 space-y-3">
                  <button
                    disabled
                    className="w-full py-3 rounded-md font-medium bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">✓</span>
                    Added to Cart
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="mt-4 w-full py-3 rounded-md transition-all font-medium bg-black hover:bg-gray-800 text-white"
                  >
                    Add More Quantity
                  </button>
                </div>
              )}

              {/* Rating and Best Seller */}
              <div className="flex items-center gap-4 mt-6">
                <p className="text-yellow-500 font-semibold">
                  ⭐ {product.rating} / 5
                </p>
                {product.bestSeller && (
                  <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
                    Best Seller
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;

// import { useContext, useEffect, useState } from "react";
// import { ProductContext } from "../Context/ProductContext";
// import { useParams } from "react-router-dom";
// import Layout from "../shared/Layout/Layout";

// const SingleProduct = () => {
//   const { id } = useParams();
//   const { productData, HandleGetProducts, HandleAddTCart, cartItems } =
//     useContext(ProductContext);

//   const [product, setProduct] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [isInCart, setIsInCart] = useState(false);
//   const [currentCartQuantity, setCurrentCartQuantity] = useState(0);

//   useEffect(() => {
//     if (!productData?.length > 0) {
//       HandleGetProducts();
//     }
//   }, [HandleGetProducts, productData]);

//   useEffect(() => {
//     if (productData?.length > 0) {
//       const found = productData.find(
//         (item) => parseInt(item.id) === parseInt(id)
//       );
//       setProduct(found);
//       setSelectedColor(found?.defaultColor || "");
//       setSelectedSize(found?.defaultSize || "");
//     }
//   }, [productData, id]);

//   // Check if product is in cart and get current quantity
//   useEffect(() => {
//     if (product && cartItems) {
//       const cartItem = cartItems.find(
//         (item) =>
//           parseInt(item.id) === parseInt(product.id) &&
//           item.size === selectedSize &&
//           item.color === selectedColor
//       );

//       if (cartItem) {
//         setIsInCart(true);
//         setCurrentCartQuantity(cartItem.quantity || 0);
//       } else {
//         setIsInCart(false);
//         setCurrentCartQuantity(0);
//       }
//     }
//   }, [cartItems, product, selectedSize, selectedColor]);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     HandleAddTCart(product, quantity, selectedSize, selectedColor);
//   };

//   if (!product) {
//     return (
//       <p className="text-center text-gray-500 mt-10">Loading product...</p>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//             {/* Product Image */}
//             <div className="flex gap-4">
//               {/* <img
//               src={product.image}
//               alt={product.name}
//               className="w-full md:w-1/2 h-80 object-cover rounded-xl"
//             /> */}
//               <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="flex flex-col">
//               <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//               <p className="text-gray-600 mb-3">{product.description}</p>

//               <div className="mb-4">
//                 <p className="text-xl font-semibold text-green-700">
//                   ${product.price}{" "}
//                   {product.discount > 0 && (
//                     <span className="text-sm text-red-500 ml-2">
//                       ({product.discount}% off)
//                     </span>
//                   )}
//                 </p>
//                 <p className="text-sm text-gray-500 uppercase mt-1">
//                   Category: {product.category} → {product.subcategory}
//                 </p>
//               </div>

//               {/* Sizes */}
//               {product?.sizes && product?.sizes.length > 0 && (
//                 <div className="mb-4">
//                   <h2 className="font-semibold mb-1">Select Size:</h2>
//                   <div className="flex gap-2">
//                     {product.sizes.map((size) => (
//                       <button
//                         key={size}
//                         onClick={() => setSelectedSize(size)}
//                         className={`border rounded-md px-3 py-1 text-sm cursor-pointer transition-all
//                       ${
//                         selectedSize === size
//                           ? "bg-black text-white border-black"
//                           : "hover:bg-gray-100"
//                       }`}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Colors */}
//               {product.colors && product.colors.length > 0 && (
//                 <div className="mb-4">
//                   <h2 className="font-semibold mb-1">Select Color:</h2>
//                   <div className="flex gap-3">
//                     {product.colors.map((color) => (
//                       <button
//                         key={color}
//                         onClick={() => setSelectedColor(color)}
//                         className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all
//                       ${
//                         selectedColor === color
//                           ? "border-black scale-110"
//                           : "border-gray-300 hover:scale-105"
//                       }`}
//                         style={{ backgroundColor: color }}
//                         title={color}
//                       ></button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Cart Status Alert */}
//               {isInCart && (
//                 <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
//                   <p className="text-sm text-green-800 font-medium">
//                     ✓ This item is already in your cart (Quantity:{" "}
//                     {currentCartQuantity})
//                   </p>
//                 </div>
//               )}

//               {/* Quantity */}
//               <div className="mb-4 flex items-center gap-3">
//                 <h2 className="font-semibold">Quantity:</h2>
//                 <div className="flex items-center border rounded-md">
//                   <button
//                     className="px-3 py-1 text-lg"
//                     onClick={() =>
//                       setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
//                     }
//                   >
//                     -
//                   </button>

//                   <input
//                     type="number"
//                     min="1"
//                     value={quantity}
//                     onChange={(e) => {
//                       const value = parseInt(e.target.value);
//                       if (!isNaN(value) && value > 0) setQuantity(value);
//                     }}
//                     className="w-16 text-center outline-none px-2 py-1"
//                   />

//                   <button
//                     className="px-3 py-1 text-lg"
//                     onClick={() => setQuantity((prev) => prev + 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               {/* Add to Cart */}

//                {!isInCart ? (
//                 <button
//                   onClick={handleAddToCart}
//                   className="mt-4 w-full py-3 rounded-md transition-all font-medium bg-black hover:bg-gray-800 text-white"
//                 >
//                   Add to Cart
//                 </button>
//               ) : (
//                 <div className="mt-4 space-y-3">
//                   <button
//                     disabled
//                     className="w-full py-3 rounded-md font-medium bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     <span className="text-lg">✓</span>
//                     Added to Cart
//                   </button>

//                    <button
//                     onClick={handleAddToCart}
//                      className="mt-4 w-full py-3 rounded-md transition-all font-medium bg-black hover:bg-gray-800 text-white"
//                   >
//                     Add More Quantity
//                   </button>

//                 </div>
//               )}

//               {/* <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   HandleAddTCart(
//                     product,
//                     quantity,
//                     selectedSize,
//                     selectedColor
//                   );
//                 }}
//                 className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all"
//               >
//                 Add to Cart
//               </button> */}

//               {/* Rating and Best Seller */}
//               <div className="flex items-center gap-4 mt-6">
//                 <p className="text-yellow-500 font-semibold">
//                   ⭐ {product.rating} / 5
//                 </p>
//                 {product.bestSeller && (
//                   <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
//                     {product?.bestSeller && <span>Best Seller</span>}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default SingleProduct;

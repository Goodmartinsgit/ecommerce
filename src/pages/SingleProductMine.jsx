// import { useContext, useEffect, useState } from "react";
// import { ProductContext } from "../Context/ProductContext";
// import { useParams } from "react-router-dom";
// import Layout from "../shared/Layout/Layout";
// // import Layout from "../Shared/Layout/Layout";

// const SingleProduct = () => {
//   const { id } = useParams();
//   const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);

//   const [product, setProduct] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [quantity, setQuantity] = useState(1);

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
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   HandleAddTCart(product, quantity, selectedSize, selectedColor);
//                 }}
//                 className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all"
//               >
//                 Add to Cart
//               </button>

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










// import { useContext, useEffect, useState } from "react";
// import { ProductContext } from "../Context/ProductContext";
// import { useParams } from "react-router-dom";
// import Layout from "../shared/Layout/Layout";
// import { Star, ShoppingCart, Truck, Shield, Heart } from "lucide-react";

// const SingleProduct = () => {
//   const { id } = useParams();
//   const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);

//   const [product, setProduct] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [activeImage, setActiveImage] = useState(0);

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
//       setSelectedColor(found?.defaultColor || found?.colors?.[0] || "");
//       setSelectedSize(found?.defaultSize || found?.sizes?.[0] || "");
//     }
//   }, [productData, id]);

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
    
//     if (!selectedSize && product?.sizes?.length > 0) {
//       alert("Please select a size");
//       return;
//     }
    
//     if (!selectedColor && product?.colors?.length > 0) {
//       alert("Please select a color");
//       return;
//     }

//     setIsAddingToCart(true);
//     try {
//       await HandleAddTCart(product, quantity, selectedSize, selectedColor);
//       // Optional: Show success message
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     } finally {
//       setTimeout(() => setIsAddingToCart(false), 600);
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (!isNaN(value) && value > 0) {
//       setQuantity(value);
//     } else if (e.target.value === "") {
//       setQuantity(1);
//     }
//   };

//   const incrementQuantity = () => setQuantity((prev) => prev + 1);
//   const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   if (!product) {
//     return (
//       <Layout>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
//             <p className="text-gray-600 text-lg">Loading product...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   // Mock multiple images - in real app, product would have image array
//   const productImages = [product.image, product.image, product.image];
//   const discountedPrice = product.discount > 0 
//     ? (product.price * (1 - product.discount / 100)).toFixed(2)
//     : product.price;

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//           {/* Breadcrumb */}
//           <nav className="text-sm text-gray-500 mb-6">
//             <span className="hover:text-gray-700 cursor-pointer">Home</span>
//             <span className="mx-2">/</span>
//             <span className="hover:text-gray-700 cursor-pointer">{product.category}</span>
//             <span className="mx-2">/</span>
//             <span className="hover:text-gray-700 cursor-pointer">{product.subcategory}</span>
//             <span className="mx-2">/</span>
//             <span className="text-gray-900 font-medium">{product.name}</span>
//           </nav>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
//             {/* Product Images */}
//             <div className="space-y-4">
//               {/* Main Image */}
//               <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group">
//                 <img
//                   src={productImages[activeImage]}
//                   alt={product.name}
//                   className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
                
//                 {/* Badges */}
//                 <div className="absolute top-4 left-4 flex flex-col gap-2">
//                   {product.bestSeller && (
//                     <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
//                       BEST SELLER
//                     </span>
//                   )}
//                   {product.discount > 0 && (
//                     <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
//                       -{product.discount}% OFF
//                     </span>
//                   )}
//                 </div>

//                 {/* Favorite Button */}
//                 <button
//                   onClick={() => setIsFavorite(!isFavorite)}
//                   className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
//                 >
//                   <Heart
//                     size={22}
//                     className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}
//                   />
//                 </button>
//               </div>

//               {/* Thumbnail Images */}
//               {/* <div className="flex gap-3">
//                 {productImages.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setActiveImage(idx)}
//                     className={`flex-1 bg-white rounded-lg overflow-hidden border-2 transition-all ${
//                       activeImage === idx
//                         ? "border-black shadow-md"
//                         : "border-gray-200 hover:border-gray-400"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`${product.name} view ${idx + 1}`}
//                       className="w-full h-24 object-cover"
//                     />
//                   </button>
//                 ))}
//               </div> */}
//             </div>

//             {/* Product Info */}
//             <div className="flex flex-col bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
//               {/* Title and Rating */}
//               <div className="mb-4">
//                 <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
//                   {product.name}
//                 </h1>
                
//                 <div className="flex items-center gap-4 mb-3">
//                   <div className="flex items-center gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         size={18}
//                         className={
//                           i < Math.floor(product.rating)
//                             ? "fill-yellow-400 text-yellow-400"
//                             : "text-gray-300"
//                         }
//                       />
//                     ))}
//                     <span className="ml-2 text-sm font-semibold text-gray-700">
//                       {product.rating} / 5
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-500">(128 reviews)</span>
//                 </div>

//                 <p className="text-gray-600 leading-relaxed">{product.description}</p>
//               </div>

//               {/* Price */}
//               <div className="mb-6 pb-6 border-b border-gray-200">
//                 <div className="flex items-baseline gap-3">
//                   <span className="text-4xl font-bold text-gray-900">
//                     ${discountedPrice}
//                   </span>
//                   {product.discount > 0 && (
//                     <span className="text-xl text-gray-400 line-through">
//                       ${product.price}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm text-green-600 mt-2 font-medium">
//                   ✓ In Stock - Ships within 24 hours
//                 </p>
//               </div>

//               {/* Sizes */}
//               {product?.sizes && product?.sizes.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-900 mb-3">
//                     Size: <span className="font-normal text-gray-600">{selectedSize}</span>
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {product.sizes.map((size) => (
//                       <button
//                         key={size}
//                         onClick={() => setSelectedSize(size)}
//                         className={`border-2 rounded-lg px-5 py-2.5 font-medium transition-all hover:scale-105 ${
//                           selectedSize === size
//                             ? "bg-black text-white border-black"
//                             : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
//                         }`}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Colors */}
//               {product.colors && product.colors.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-900 mb-3">
//                     Color: <span className="font-normal text-gray-600 capitalize">{selectedColor}</span>
//                   </h3>
//                   <div className="flex gap-3">
//                     {product.colors.map((color) => (
//                       <button
//                         key={color}
//                         onClick={() => setSelectedColor(color)}
//                         className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
//                           selectedColor === color
//                             ? "border-black ring-2 ring-offset-2 ring-black"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: color }}
//                         title={color}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Quantity */}
//               <div className="mb-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">Quantity:</h3>
//                 <div className="flex items-center border-2 border-gray-300 rounded-lg w-fit">
//                   <button
//                     onClick={decrementQuantity}
//                     className="px-4 py-2.5 text-xl font-semibold hover:bg-gray-100 transition-colors"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="w-20 text-center text-lg font-medium outline-none"
//                   />
//                   <button
//                     onClick={incrementQuantity}
//                     className="px-4 py-2.5 text-xl font-semibold hover:bg-gray-100 transition-colors"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               {/* Add to Cart Button */}
//               <button
//                 onClick={handleAddToCart}
//                 disabled={isAddingToCart}
//                 className={`w-full bg-black text-white py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
//                   isAddingToCart
//                     ? "opacity-70 cursor-not-allowed"
//                     : "hover:bg-gray-800 hover:shadow-xl"
//                 }`}
//               >
//                 <ShoppingCart size={22} />
//                 {isAddingToCart ? "Adding..." : "Add to Cart"}
//               </button>

//               {/* Features */}
//               <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-gray-100 p-2.5 rounded-lg">
//                     <Truck size={20} className="text-gray-700" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-gray-900">Free Delivery</p>
//                     <p className="text-xs text-gray-500">Orders over $50</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="bg-gray-100 p-2.5 rounded-lg">
//                     <Shield size={20} className="text-gray-700" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-gray-900">Secure Payment</p>
//                     <p className="text-xs text-gray-500">100% Protected</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="bg-gray-100 p-2.5 rounded-lg">
//                     <svg
//                       className="w-5 h-5 text-gray-700"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-gray-900">Easy Returns</p>
//                     <p className="text-xs text-gray-500">30-day policy</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Category Info */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-semibold text-gray-900">Category:</span>{" "}
//                   {product.category} → {product.subcategory}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default SingleProduct;











import { useContext, useEffect, useState } from "react";
// import { ProductContext } from "../Context/ProductContext";
import { useParams } from "react-router-dom";
import Layout from "../shared/Layout/Layout";
import { ProductContext } from "../context/ProductContext";

const SingleProduct = () => {
  const { id } = useParams();
  const { productData, HandleGetProducts, HandleAddTCart, cartItems } = useContext(ProductContext);

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
                    ✓ This item is already in your cart (Quantity: {currentCartQuantity})
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
                  <h3 className="font-semibold mb-2 text-gray-800">Quantity Summary:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current in cart:</span>
                      <span className="font-medium">{currentCartQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adding:</span>
                      <span className="font-medium text-blue-600">+{quantity}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="font-semibold text-gray-800">Total quantity:</span>
                      <span className="font-bold text-lg text-green-600">{totalQuantity}</span>
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
                    className="w-full py-3 rounded-md transition-all font-medium bg-blue-600 hover:bg-blue-700 text-white"
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
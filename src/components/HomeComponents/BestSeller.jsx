// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ProductContext } from "../../context/ProductContext";
// import { CiHeart } from "react-icons/ci";
// import { FaHeart } from "react-icons/fa";
// import { IoBagAdd, IoBagAddOutline } from "react-icons/io5";

// const BestSeller = () => {
//   const { HandleGetProducts, productData } = useContext(ProductContext);
//   const [bestSeller, setBestSeller] = useState([]);
//   const [few, setFew] = useState([]);
//   const [fewDisplay, setFewDisplay] = useState(true);
//   const [favorites, setFavorites] = useState({});
//   const [addToCart, setAddToCart] = useState({});

//   useEffect(() => {
//     HandleGetProducts();
//   }, []);

//   useEffect(() => {
//     if (productData && productData.length > 0) {
//       const less = productData.slice(0, 3);
//       setFew(less);

//       const found = productData.filter((item) => item.bestSeller === true);
//       setBestSeller(found);
//     }
//   }, [productData]);

//   const displayedProducts = fewDisplay ? few : bestSeller;

//   const toggleFavorite = (productId) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [productId]: !prev[productId],
//     }));
//   };

//   const toggleAddToCart = (productId) => {
//     setAddToCart((prev) => ({
//       ...prev,
//       [productId]: !prev[productId],
//     }));
//   };

//   return (
//     <div className="bg-white lg:pt-12 pt-2">
//       <p className="text-center text-primary text-2xl font-semibold w-full mt-8">
//         Best Seller
//       </p>
//       <p className="text-center text-primary w-full mt-2 text-lg">
//         Stay cozy and stylish with our exclusive collection of best-selling
//         hoodies.
//       </p>

//       {/* Product Grid */}
//       <div className="px-4 md:px-10 lg:px-20 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16 gap-16 justify-center items-stretch lg:mt-6 mt-8">
//         {displayedProducts.map((product) => (
//           <div
//             key={product.id}
//             className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden"
//           >
//             <div className="w-full h-[26rem] overflow-hidden">
//               <Link to={`/product/${product.id}`} className="w-full h-full">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="object-cover w-full bg-gray-500 h-full"
//                 />
//               </Link>
//             </div>

//             <div className="p-2">
//               <p className="text-black font-bold mt-2">{product.name}</p>
//               <p className="text-black mt-2 line-clamp-2">
//                 {product.description}
//               </p>

//               <div className="flex justify-between items-center mt-2">
//                 <span className="p-2 bg-primary text-white rounded-md">
//                   ₦{product.price}
//                 </span>

//                 <div className="flex gap-4 items-center">
//                   <button
//                     onClick={() => toggleFavorite(product.id)}
//                     className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer transition "
//                   >
//                     {favorites[product.id] ? (
//                       <FaHeart className="h-6 w-6 text-red-500" />
//                     ) : (
//                       <CiHeart className="h-6 w-6"/>
//                     )}
//                   </button>
//                   <button 
//                   onClick={() => toggleAddToCart(product.id)}
//                   className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer hover:bg-slate-300 hover:text-white transition">
                                        
//                     {addToCart[product.id] ? (
//                       <IoBagAdd className="h-6 w-6 text-green-700" />
//                     ) : (
//                       <IoBagAddOutline className="h-6 w-6 " />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* See More / Less Button */}
//       <div className="flex justify-center mt-8">
//         {fewDisplay ? (
//           <button
//             onClick={() => setFewDisplay(false)}
//             className="rounded-md bg-white text-black border-2 border-primary cursor-pointer px-6 py-2 hover:bg-primary hover:text-white transition"
//           >
//             See More
//           </button>
//         ) : (
//           <button
//             onClick={() => setFewDisplay(true)}
//             className="rounded-md bg-white text-black border-2 border-primary cursor-pointer px-6 py-2 hover:bg-primary hover:text-white transition"
//           >
//             See Less
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BestSeller;













import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { ProductContext } from "../../context/ProductContext";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoBagAdd, IoBagAddOutline } from "react-icons/io5";
import ProductContext from "../../context/ProductContext";

const BestSeller = () => {
  const { HandleGetProducts, productData } = useContext(ProductContext);
  const navigate = useNavigate();
  const [few, setFew] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [addToCart, setAddToCart] = useState({});

  useEffect(() => {
    HandleGetProducts();
  }, []);

  useEffect(() => {
    if (productData && productData.length > 0) {
      const less = productData.slice(0, 3);
      setFew(less);
    }
  }, [productData]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const toggleAddToCart = (productId) => {
    setAddToCart((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="bg-white lg:pt-12 pt-2">
      <p className="text-center text-primary text-2xl font-semibold w-full mt-8">
        Best Seller
      </p>
      <p className="text-center text-primary w-full mt-2 text-lg">
        Stay cozy and stylish with our exclusive collection of best-selling
        hoodies.
      </p>

      {/* Product Grid */}
      <div className="px-4 md:px-10 lg:px-20 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16 gap-16 justify-center items-stretch lg:mt-6 mt-8">
        {few.map((product) => (
          <div
            key={product.id}
            className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden"
          >
            <div className="w-full h-[26rem] overflow-hidden">
              <Link to={`/product/${product.id}`} className="w-full h-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full bg-gray-500 h-full"
                />
              </Link>
            </div>

            <div className="p-2">
              <p className="text-black font-bold mt-2">{product.name}</p>
              <p className="text-black mt-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center mt-2">
                <span className="p-2 bg-primary text-white rounded-md">
                  ₦{product.price}
                </span>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer transition "
                  >
                    {favorites[product.id] ? (
                      <FaHeart className="h-6 w-6 text-red-500" />
                    ) : (
                      <CiHeart className="h-6 w-6"/>
                    )}
                  </button>
                  <button 
                    onClick={() => toggleAddToCart(product.id)}
                    className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer hover:bg-slate-300 hover:text-white transition"
                  >
                    {addToCart[product.id] ? (
                      <IoBagAdd className="h-6 w-6 text-green-700" />
                    ) : (
                      <IoBagAddOutline className="h-6 w-6 " />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/bestSellers')}
          className="rounded-md bg-white text-black border-2 border-primary cursor-pointer px-6 py-2 hover:bg-primary hover:text-white transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default BestSeller;
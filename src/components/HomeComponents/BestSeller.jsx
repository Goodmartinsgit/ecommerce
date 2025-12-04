import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoBagAddOutline } from "react-icons/io5";
import { Sparkles } from "lucide-react";
import ProductContext from "../../context/NewProductContext";
import { getProductImage, handleImageError } from "../../utils/imageHelper";

const BestSeller = () => {
  const { HandleGetProducts, productData, HandleAddToCart, HandleToggleWishlist, IsInWishlist } = useContext(ProductContext);
  const navigate = useNavigate();
  const [few, setFew] = useState([]);

  useEffect(() => {
    if (!productData || productData.length === 0) {
      HandleGetProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productData && productData.length > 0) {
      const less = productData.slice(0, 3);
      setFew(less);
    }
  }, [productData]);

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
            className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden relative"
          >
            {/* New Badge */}
            {product.newArrival && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  NEW
                </span>
              </div>
            )}

            <div className="w-full h-[26rem] overflow-hidden">
              <Link to={`/product/${product.id}`} className="w-full h-full">
                <img
                  src={getProductImage(product.image)}
                  alt={product.name}
                  onError={handleImageError}
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
                    onClick={() => HandleToggleWishlist(product)}
                    className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer transition "
                  >
                    {IsInWishlist(product.id) ? (
                      <FaHeart className="h-6 w-6 text-red-500" />
                    ) : (
                      <CiHeart className="h-6 w-6"/>
                    )}
                  </button>
                  <button
                    onClick={() => HandleAddToCart(product, 1, product.defaultSize, product.defaultColor)}
                    className="rounded-full p-1 bg-white border border-primary flex justify-center items-center cursor-pointer hover:bg-slate-300 hover:text-white transition"
                  >
                    <IoBagAddOutline className="h-6 w-6" />
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

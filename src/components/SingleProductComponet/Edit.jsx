import { useContext } from "react";
import ProductContext from "../../context/NewProductContext";

const Edit = ({
  prod,
  setSelectedSize,
  selectedSize,
  selectedColor,
  setSelectedColor,
  isInCart,
  currentCartQuantity,
  setQuantity,
  quantity,
  handleAddToCart,
}) => {

  const {HandleUpdateCart} = useContext(ProductContext)
  return (
    <div className="min-h-screen bg-white">
        <h2 className="flex justify-center items-center ">Add to cart</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="flex gap-4">
            {/* <img
              src={product.image}
              alt={product.name}
              className="w-full md:w-1/2 h-80 object-cover rounded-xl"
            /> */}
            <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={prod?.image}
                alt={prod?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{prod?.name}</h1>
            <p className="text-gray-600 mb-3">{prod?.description}</p>

            <div className="mb-4">
              <p className="text-xl font-semibold text-green-700">
                ${prod?.price}{" "}
                {prod?.discount > 0 && (
                  <span className="text-sm text-red-500 ml-2">
                    ({prod?.discount}% off)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 uppercase mt-1">
                Category: {prod?.category} → {prod?.subcategory}
              </p>
            </div>

            {/* Sizes */}
            {prod?.sizes && prod?.sizes.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Select Size:</h2>
                <div className="flex gap-2">
                  {prod?.sizes.map((size) => (
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
            {prod?.colors && prod?.colors.length > 0 && (
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Select Color:</h2>
                <div className="flex gap-3">
                  {prod?.colors.map((color) => (
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
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-semibold">Quantity:</h2>
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-1 text-lg"
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
                  className="px-3 py-1 text-lg"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}

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
              </div>
            )}

            {/* <button
                onClick={(e) => {
                  e.preventDefault();
                  HandleAddTCart(
                    product,
                    quantity,
                    selectedSize,
                    selectedColor
                  );
                }}
                className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all"
              >
                Add to Cart
              </button> */}

            {/* Rating and Best Seller */}
            <div className="flex items-center gap-4 mt-6">
              <p className="text-yellow-500 font-semibold">
                ⭐ {prod?.rating} / 5
              </p>
              {prod?.bestSeller && (
                <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
                  {prod?.bestSeller && <span>Best Seller</span>}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
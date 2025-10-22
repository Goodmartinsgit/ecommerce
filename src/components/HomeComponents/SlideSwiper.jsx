import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductContext from '../../context/NewProductContext';

export default function SlideSwiper() {
  const { HandleGetProducts, productData } = useContext(ProductContext);
  const navigate = useNavigate();
    
  useEffect(() => {
    HandleGetProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-12 mb-16 relative">
      <Swiper
        autoplay={{ 
          delay: 2500, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        spaceBetween={16}
        slidesPerView={1}
        loop={productData && productData.length > 4}
        speed={800}
        centeredSlides={true}
        grabCursor={true}
        modules={[Autoplay, Navigation]}
        breakpoints={{
          320: { 
            slidesPerView: 1.2,
            spaceBetween: 12,
            centeredSlides: true
          },
          480: { 
            slidesPerView: 1.5,
            spaceBetween: 14,
            centeredSlides: true
          },
          640: { 
            slidesPerView: 2,
            spaceBetween: 16,
            centeredSlides: true
          },
          768: { 
            slidesPerView: 3,
            spaceBetween: 18,
            centeredSlides: true
          },
          1024: { 
            slidesPerView: 4,
            spaceBetween: 20,
            centeredSlides: true
          },
          1280: { 
            slidesPerView: 5,
            spaceBetween: 24,
            centeredSlides: true
          },
        }}
        className="w-full !py-8"
      >
        {productData && productData.length > 0 ? (
          productData.map((product, index) => (
            <SwiperSlide 
              key={product?.id || index}
              className="!h-auto transition-all duration-300"
            >
              {({ isActive }) => (
                <div 
                  onClick={() => handleProductClick(product?.id)}
                  className={`group relative w-full h-64 sm:h-72 md:h-80 lg:h-96 rounded-t-[50%] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'scale-110 z-10 shadow-2xl' 
                      : 'scale-90 opacity-70'
                  }`}
                >
                  <img
                    src={product?.image}
                    alt={product?.name || `Fashion item ${index + 1}`}
                    loading="lazy"
                    className="object-cover w-full h-full bg-gray-500 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                  {product?.name && (
                    <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-transform duration-300 ${
                      isActive ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
                    }`}>
                      <h3 className="font-semibold text-sm md:text-base truncate">
                        {product.name}
                      </h3>
                      {product?.price && (
                        <p className="text-xs md:text-sm opacity-90">
                          {`₦${product.price}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-white">
            <p className="text-gray-400">No products available</p>
          </div>
        )}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button 
        className="swiper-button-prev-custom absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>
      
      <button 
        className="swiper-button-next-custom absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>
    </div>
  );
}
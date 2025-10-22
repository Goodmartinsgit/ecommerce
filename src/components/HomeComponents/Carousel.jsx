<div className="w-full md:px-4 px-28 flex flex-col justify-center items-center">
          <Swiper
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            spaceBetween={20}
            loop={true}
            speed={1000}
            slidesPerView={1}
            lazy= "true"
            modules={[Autoplay]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full md:h-60 h-80 flex flex-col justify-center items-center"
          >
            {productData &&
              productData?.map((product, index) => (
                <SwiperSlide 
                  key={product?.id || index}
                  className="flex justify-center items-center md:w-full w-1/2 mt-10 rounded-t-[50%] overflow-hidden"
                >
                  <Link to={`/product/${product?.id}`} className="w-full h-full">
                  
                  <img
                    src={product?.image}
                    alt={product?.name || "Fashion item"}
                    className="object-cover w-full h-full"
                  />
                  </Link>

                </SwiperSlide>
              ))}
          </Swiper>
        </div>





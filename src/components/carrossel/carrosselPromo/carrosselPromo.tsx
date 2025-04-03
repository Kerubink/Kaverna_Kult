import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

function CarrosselPromo() {
  const promotions = [
    "Frete grátis para compras acima de R$200!",
    "30% de desconto na primeira compra!",
    "Compre 2, leve 3 em acessórios selecionados!",
    "Desconto especial em roupas de inverno!",
    "Promoção por tempo limitado: até 50% off!",
  ];

  return (
    <div className="w-full bg-gray-100 text-center text-sm text-gray-700 py-2">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={12}
        slidesPerView={1}
        centeredSlides={true}
        className="w-full h-full"
      >
        {promotions.map((promo, index) => (
          <SwiperSlide key={index}>
            <span className="px-4">{promo}</span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CarrosselPromo;

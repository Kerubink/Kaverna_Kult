import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect } from "react";
import styles from "./carrossel.module.css";

function Carrossel() {
  useEffect(() => {
    const swiper = document.querySelector(".swiper").swiper;
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    <section className="h-[450px] flex flex-col items-center lg:flex-row text-white bg-black relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: `.${styles.custom_next}`,
          prevEl: `.${styles.custom_prev}`,
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000 }}
        loop={true}
        spaceBetween={12}
        slidesPerView={1}
        centeredSlides={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center flex justify-center items-center"
            style={{
              backgroundImage: `url('./a.jpeg')`,
            }}
          >
            
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center flex justify-center items-center"
            style={{
              backgroundImage: `url('b.jpeg')`,
            }}
          >
            
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center bg-white flex justify-center items-center"
            style={{
              backgroundImage: `url('https://via.placeholder.com/1200x600/7fff7f/333333')`,
            }}
          >
            
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Botões Personalizados */}
      {/* <button className={`${styles.custom_prev}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button className={`${styles.custom_next}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button> */}
    </section>
  );
}

export default Carrossel;

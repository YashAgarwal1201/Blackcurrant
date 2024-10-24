import { Key, useEffect, useRef } from "react";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
// import { Button } from "primereact/button";

const SwiperContainer = ({ children }) => {
  const swiperContainerRef = useRef<HTMLDivElement | null>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);

  useEffect(() => {
    if (swiperContainerRef.current) {
      // Initialize Swiper
      swiperInstanceRef.current = new Swiper(swiperContainerRef.current, {
        modules: [Navigation, Pagination],
        direction: "horizontal",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        allowTouchMove: true, // Ensure touch move is allowed
        slidesPerView: "auto",
        // freeMode: {
        //   enabled: true,
        //   minimumVelocity: 0,
        //   momentumBounce: false,
        //   momentum: true,
        //   sticky: false,
        // },
        freeMode: true,
        mousewheel: true,
      });
    }

    // Cleanup function to destroy Swiper instance on unmount
    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy();
        swiperInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="swiper w-full h-[40px]" ref={swiperContainerRef}>
      <div className="swiper-wrapper">{children}</div>
    </div>
  );
};

export default SwiperContainer;

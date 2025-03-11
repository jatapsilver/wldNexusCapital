import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";

SwiperCore.use([Pagination]);

const investmentsSlider = {
  slides: [
    {
      images: [
        {
          title: "FINTECH",
          second: "BANK",
          path: "/investments/fintech.png",
        },
        {
          title: "ARBITRAJE",
          second: "ACTIVOS",
          path: "/investments/arbitraje.png",
        },
        {
          title: "MERCADO",
          second: "OTC",
          path: "/investments/otc.png",
        },
        {
          title: "NODOS",
          second: "BLOCKCHAIN",
          path: "/investments/nodos.png",
        },
      ],
    },
    {
      images: [
        {
          title: "ASISTENTES",
          second: "IA",
          path: "/investments/ia.png",
        },
        {
          title: "FOREX",
          second: "ALTA FRECUENCIA",
          path: "/investments/trading.png",
        },
        {
          title: "COMODITIES",
          second: "",
          path: "/investments/comodities.png",
        },
        {
          title: "ACCIONES",
          second: "",
          path: "/investments/acciones.png",
        },
      ],
    },
  ],
};

const InvestmentSlider = () => {
  return (
    <Swiper
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="h-[280px] sm:h-[500px]"
    >
      {investmentsSlider.slides.map((slide, index) => {
        return (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 cursor-pointer">
              {slide.images.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden flex items-center justify-center group"
                  >
                    <div className="flex items-center justify-center relative overflow-hidden group">
                      <Image src={image.path} width={500} height={300} alt="" />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700"></div>
                      {/*title*/}
                      <div className="absolute bottom-0 translate-y-full group-hover:-translate-y-10 group-hover:xl:-translate-y-20 transition-all duration-300">
                        <div className="flex flex-wrap justify-center items-center gap-x-2 text-[13px] tracking-[0.2em]">
                          <div className="delay-100">{image.title}</div>
                          <div className="translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                            {image.second}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default InvestmentSlider;

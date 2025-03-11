import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

SwiperCore.use([Pagination, FreeMode]);

import {
  RxPencil2,
  RxDesktop,
  RxReader,
  RxArrowTopRight,
  RxTrackNext,
  RxMix,
  RxAllSides,
  RxGlobe,
  RxGear,
  RxShuffle,
  RxCodesandboxLogo,
} from "react-icons/rx";

// data
const serviceData = [
  {
    icon: <RxTrackNext />,
    title: "Starter",
    description: "Comienza con lo esencial para IA.",
  },
  {
    icon: <RxPencil2 />,
    title: "Assistant",
    description: "Asistente virtual para tareas básicas.",
  },
  {
    icon: <RxMix />,
    title: "Smart Bot",
    description: "Bot inteligente para tareas avanzadas.",
  },
  {
    icon: <RxDesktop />,
    title: "Vision",
    description: "Visión artificial para Traders.",
  },
  {
    icon: <RxReader />,
    title: "Tools IA",
    description: "Herramientas de IA para mejorar flujos.",
  },
  {
    icon: <RxAllSides />,
    title: "Automation",
    description: "Automatiza tareas con inteligencia artificial.",
  },
  {
    icon: <RxGlobe />,
    title: "Cloud",
    description: "IA accesible desde la nube, sin límites.",
  },
  {
    icon: <RxGear />,
    title: "Generador IA",
    description: "Generador de IA autonomos",
  },
  {
    icon: <RxShuffle />,
    title: "DeepLearn",
    description: "Aprendizaje profundo para análisis complejos.",
  },
  {
    icon: <RxCodesandboxLogo />,
    title: "Quantum",
    description: "IA avanzada en computación cuántica.",
  },
];

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination]}
      className="h-[240px] sm:h-[340px]"
    >
      {serviceData.map((service, index) => {
        return (
          <SwiperSlide key={index}>
            <div className="bg-[rgba(65,47,123,0.15)] h-max rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300 ">
              <div className="text-4xl text-accent-landing mb-4">
                {service.icon}
              </div>
              <div className="mb-8">
                <div className="mb-2 text-lg">{service.title}</div>
                <p className="max-w-[350px] leading-normal">
                  {service.description}
                </p>
              </div>
              <div className="text-3xl">
                <RxArrowTopRight className="group-hover:rotate-45 group-hover:text-accent-landing transition-all duration-300" />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;

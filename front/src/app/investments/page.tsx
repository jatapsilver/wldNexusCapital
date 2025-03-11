"use client";
//component
import InvestmentSlider from "../../components/InvestmentsSlide";
import Bulb from "../../components/Bulb";
import Circles from "@/components/Circles";

//framer-motion
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/variants";
const Investments = () => {
  return (
    <div className="h-full bg-primary-landing-30 py-36 flex items-center relative overflow-x-hidden">
      <Circles />
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-x-8">
          <div className="text-center flex xl:w-[30vw] flex-col lg:text-left mb-4 xl:mb-0s">
            <motion.h2
              variants={fadeIn("up", 0.3)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="h2 xl:mt-12"
            >
              Nuestra Inversiones<span className="text-accent-landing">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-4 max-w-[400px] mx-auto lg:mx-0"
            >
              Descubre nuestras inversiones en los sectores más innovadores del
              mundo: fintech, blockchain y tecnología.
            </motion.p>
          </div>
          <motion.div
            variants={fadeIn("down", 0.6)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%]"
          >
            <InvestmentSlider />
          </motion.div>
        </div>
      </div>
      <Bulb />
    </div>
  );
};

export default Investments;

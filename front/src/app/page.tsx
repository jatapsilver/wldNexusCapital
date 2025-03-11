"use client";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/variants";

//Components
import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import Avatar from "../components/Avatar";

export default function Home() {
  return (
    <div className="bg-primary-landing h-full overflow-x-auto">
      <div className="w-full h-full bg-gradient-to-r from-primary-landing/10 via-black-30 to black-10 ">
        <div className="text-center flex flex-col justify-center xl:pt-40 xl:text-left h-full container mx-auto">
          <motion.h1
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h1 text-5xl xl:text-6xl xxl:text-7xl mt-12 xl:-mt-20 "
          >
            Evoluciona
            <br />
            Transforma <br />{" "}
            <span className="text-accent-landing">Domina</span>
          </motion.h1>
          <motion.p
            variants={fadeIn("down", 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-8 xl:mb-4 xxl:mb-8 xl:mb-16 text-2sm xxl:text-xl "
          >
            NeuroBot IA es tu arma definitiva en el trading impulsado por
            inteligencia artificial analiza Mercados en tiempo real ejecuta
            operaciones automáticas y Optimiza estrategias en criptomonedas
            Forex y acciones con velocidad extrema ejecución precisa y
            estrategias inteligentes sin margen de error no sigas el mercado
            contrólalo con NeuroBot IA
          </motion.p>
          <motion.div
            variants={fadeIn("down", 0.4)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex justify-center xl:justify-start relative z-30 "
          >
            <ProjectsBtn />
          </motion.div>
        </div>
      </div>
      <div className="w-[1200px] h-full absolute right-0 bottom-0">
        <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-color-dodge translate-z-0"></div>

        <ParticlesContainer />

        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          animate="show"
          exit="hidden"
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full h-full max-w-[737px] max-h-[678px] absolute -bottom-32 lg:bottom-0 lg:right-[8%]"
        >
          <Avatar />
        </motion.div>
      </div>
    </div>
  );
}

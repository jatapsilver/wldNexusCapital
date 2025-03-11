"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/variants";
import CountUp from "react-countup";
import Avatar from "../../components/Avatar";
import Circles from "../../components/Circles";

type AboutInfo = {
  title: string;
  stage?: string;
  icons?: IconType[];
};

const aboutData: { title: string; info: AboutInfo[] }[] = [
  {
    title: "Aliados",
    info: [
      { title: "Binance", stage: "Amazon Web Services" },
      { title: "MetaTrader", stage: "Interactive Brokers" },
      {
        title: "IBM Watson",
        stage: "Google Cloud AI",
      },
    ],
  },
  {
    title: "Productos",
    info: [
      { title: "Forex", stage: "Acciones" },
      { title: "Criptomonedas", stage: "ETFs" },
      { title: "Futuros", stage: "Commodites" },
    ],
  },
  {
    title: "Certificaciones",
    info: [
      {
        title: "Chartered Financial Analyst",
      },
      {
        title: "Financial Conduct Authority License",
      },
      {
        title: "Cyprus Securities and Exchange Commission License",
      },
      {
        title: "General Securities Representative License",
      },
    ],
  },
];

export default function About() {
  const [index, setIndex] = useState(0);

  return (
    <div className="h-full bg-primary-landing/30 py-32 text-center xl:text-left relative overflow-x-hidden">
      <Circles />
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="hidden xl:flex absolute bottom-0 -left-[270px]"
      >
        <Avatar />
      </motion.div>
      <div className="container mx-auto flex flex-col xl:flex-row gap-x-6 h-full items-center">
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex-1 flex flex-col justify-center items-center"
        >
          <h2 className="h2 text-center xl:mt-20 xxl:mt-0 xl:text-4xl xxl:text-5xl xl:ml-20 xxl:ml-0  ">
            No sigas el <span className="text-accent-landing">mercado</span>{" "}
            contrólalo
          </h2>
          <p className="max-w-[500px] mx-auto xl:ml-20 xxl:ml-20 mb-6 xl:mb-12 px-2 xl:px-0 text-center text-sm xl:text-base ">
            En NeuroBot IA, nuestra misión es revolucionar el trading mediante
            inteligencia artificial, brindando a traders e inversionistas una
            herramienta poderosa que analiza mercados en tiempo real, ejecutando
            operaciones automáticas y optimizando estrategias con precisión
            absoluta. Nuestra visión es liderar la transformación digital del
            trading, eliminando la incertidumbre y proporcionando una ventaja
            competitiva sin precedentes en criptomonedas, Forex y acciones
          </p>
          <div className="hidden xxl:flex max-w-xl xl:max-w-none mx-auto xl:mx-0 mb-8 gap-x-2 md:gap-x-4 xl:gap-x-8 ">
            {[
              { end: 50, label: "Alianzas" },
              { end: 80, label: "Premios" },
              { end: 70000, label: "Clientes" },
              { end: 2500, label: "Inversionistas" },
            ].map(({ end, label }) => (
              <div key={label} className="flex-1 text-center">
                <div className="text-2xl xl:text-4xl font-extrabold text-accent-landing">
                  <CountUp start={0} end={end} duration={5} />+
                </div>
                <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex flex-col w-full xl:max-w-[48%] h-[480px] xl:mt-48 xxl:mt-0"
        >
          <div className="flex gap-x-4 xl:gap-x-8 mx-auto xl:mx-0 mb-4 ">
            {aboutData.map((item, itemIndex) => (
              <button
                key={item.title}
                className={`cursor-pointer capitalize text-sm sm:text-base xl:text-lg relative z-10 
                  after:content-[''] after:block after:w-8 after:h-[2px] after:absolute after:-bottom-1 after:left-0 after:z-[-1] 
                  ${
                    index === itemIndex
                      ? "text-accent-landing after:w-full after:bg-accent-landing after:transition-all after:duration-300"
                      : "after:bg-white"
                  }`}
                onClick={() => setIndex(itemIndex)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="py-2 xl:py-6 flex flex-col gap-y-2 xl:gap-y-4 items-center xl:items-start">
            {aboutData[index].info.map(({ title, stage, icons }) => (
              <div
                key={title}
                className="flex flex-col md:flex-row max-w-max gap-x-2 items-center text-white/60"
              >
                <span className="font-light mb-2 md:mb-0">{title}</span>
                {stage && <span className="hidden md:inline"></span>}
                {stage && <span>{stage}</span>}
                <div className="flex gap-x-4">
                  {icons?.map((Icon) => (
                    <Icon key={Icon.name} className="text-2xl text-white" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["données", "modèles", "prédictions", "tendances", "insights"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 p-10 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col text-[#727272]">
            <h1 className="text-5xl md:text-7xl max-w-6xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50 font-outfit font-bold">
                Analysez le passé, comprenez le présent, anticipez l’avenir avec
                les
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#98ff87] to-[#3d96ff] italic"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight  max-w-6xl text-center text-[#000]">
              Avec EpiViz, plongez dans les données historiques des pandémies
              pour identifier des tendances, générer des prévisions et prendre
              des actions stratégiques. Un outil conçu pour les chercheurs,
              décideurs et professionnels de la santé publique.
            </p>
          </div>
        </div>
      </div>
      <div className="glow absolute opacity-35"></div>
      <div className="glow absolute opacity-35 right-4"></div>
    </div>
  );
}

export { Hero };
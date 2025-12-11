"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["talents", "singles", "albums", "tournées", "fans"],
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
          <div className="flex gap-4 flex-col items-center text-[#727272]">
            <h1 className="text-5xl md:text-7xl max-w-6xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50 font-outfit font-bold">
                Open Sound, le label qui révèle et propulse les
              </span>
              <span className="relative flex justify-center overflow-hidden h-14 xs:h-16 sm:h-20 md:h-24 mt-3 w-full">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute h-24 font-semibold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-purple-900 "
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

            <p className="text-lg w-3xl justify-center align-middle md:text-md leading-relaxed tracking-tight  max-w-6xl text-center text-black">
              Open Sound accompagne les artistes, producteurs et managers pour
              créer, distribuer et faire rayonner leurs projets. De la découverte
              des talents au développement international, nous orchestrons chaque
              étape pour que vos morceaux trouvent leur public.
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
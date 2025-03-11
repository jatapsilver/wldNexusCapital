"use client";
import Image from "next/image";
import { PackageUser } from "../dashboard/packageUser";

export function RangesDashboard() {
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Imagen de Portada */}
      <div className="w-full relative">
        <Image
          src="/dashboard/coverRanges.jpg"
          alt="User Cover"
          width={1080}
          height={400}
          className="w-full h-[10rem] md:h-[20rem] object-cover rounded-lg"
        />
      </div>

      {/* Imagen de Perfil */}
      <div className="relative -mt-20 md:-mt-32">
        <Image
          src="/dashboard/creditCard.svg"
          alt="User Credit Card"
          width={240}
          height={150}
          className="rounded-full border-4 border-white bg-white shadow-lg h-[8rem] w-[8rem] md:h-[15rem] md:w-[15rem]"
        />
      </div>

      {/* Contenedor Ajustado */}

      <div className="w-full flex justify-center">
        <PackageUser />
      </div>
    </div>
  );
}

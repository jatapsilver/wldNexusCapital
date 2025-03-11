"use client";
import Image from "next/image";
import { FormProfile } from "./formProfile";

export function ProfileDashboard() {
  const username = localStorage.getItem("username");
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full relative">
        <Image
          src="/dashboard/coverProfile.jpg"
          alt="User Cover"
          width={1080}
          height={400}
          className="w-full h-[10rem] md:h-[20rem] object-cover rounded-lg"
        />
      </div>

      {/* Imagen de Perfil */}
      <div className="relative -mt-20  md:-mt-32">
        <Image
          src="/dashboard/user.svg"
          alt=""
          width={240}
          height={150}
          className="rounded-full object-cover border-4 border-white bg-white shadow-lg h-[8rem] w-[8rem] md:h-[15rem] md:w-[15rem] object-cover"
        />
      </div>

      {/* Nombre del Usuario */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {username}
      </h1>
      <div className="w-full">
        <FormProfile />
      </div>
      <div className="mt-10 mb-20"></div>
    </div>
  );
}

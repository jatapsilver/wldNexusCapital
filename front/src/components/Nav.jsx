"use client";
import {
  HiHome,
  HiUser,
  HiRectangleGroup,
  HiMiniBuildingLibrary,
  HiMiniUserGroup,
} from "react-icons/hi2";

import Link from "next/link";
import { usePathname } from "next/navigation";

// nav data
export const navData = [
  { name: "Inicio", path: "/", icon: <HiHome /> },
  { name: "Nosotros", path: "/about", icon: <HiUser /> },
  { name: "Productos", path: "/services", icon: <HiRectangleGroup /> },
  {
    name: "Inversiones",
    path: "/investments",
    icon: <HiMiniBuildingLibrary />,
  },
  {
    name: "Login",
    path: "/login",
    icon: <HiMiniUserGroup />,
  },
];

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center xl:justify-center gap-y-4 fixed h-max bottom-0 mt-auto xl:right-[2%] z-50 top-0 w-full xl:w-16 xl:max-w-md xl:h-screen">
      <div className="flex w-full xl:flex-col items-center justify-between xl:justify-center gap-y-10 px-4 md:px-40 xl:px-0 h-[80px] bg-black/50 xl:h-max py-8 bg-white-10 backdrop-blur-sm text-3xl xl:text-xl xl:rounded-full">
        {navData.map((link, index) => {
          return (
            <Link
              className={`${
                link.path === pathname ? "text-accent-landing" : ""
              } relative flex item-center group hover:text-accent-landing transition-all duration-300`}
              href={link.path}
              key={link.name}
            >
              <div className="absolute pr-14 right-0 hidden xl:group-hover:flex">
                <div className="bg-white relative flex text-primary-landing items-center p-[6px] rounded-[3px]">
                  <div className="text-[12px] leading-none font-semibold capitalize">
                    {link.name}
                  </div>
                  <div className="border-solid border-l-white border-l-8 border-y-transparent border-y-[6px] border-r-0 absolute -right-2"></div>
                </div>
              </div>
              <div>{link.icon}</div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Nav;

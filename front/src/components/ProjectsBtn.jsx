import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { Button } from "../components/ui/button";

const ProjectsBtn = () => {
  return (
    <div className="mx-auto xl:mx-0">
      <Link href="/login" className="">
        <Button className="cursor-pointer bg-black/80 hover:bg-white/80 hover:text-black hover:-translate-y-4 transition-all duration-500 rounded-3xl text-2xl p-10 z-30">
          Iniciar Sesion
        </Button>
      </Link>
    </div>
  );
};

export default ProjectsBtn;

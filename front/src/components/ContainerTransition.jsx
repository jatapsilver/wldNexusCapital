"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Component
import Transition from "./Transition";

const ContainerTransition = () => {
  const pathname = usePathname();
  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        className="fixed top-0 left-0 right-0 z-10 h-full"
      >
        <Transition />
      </motion.div>
    </AnimatePresence>
  );
};

export default ContainerTransition;

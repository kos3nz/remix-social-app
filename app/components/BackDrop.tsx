// import { useEffect } from "react";
// import { stateLogger } from "../../stateLogger";
import { motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

const Backdrop = ({ children, onClick }: Props) => {
  // Log state
  // useEffect(() => {
  //   stateLogger("Backdrop", true);
  //   return () => stateLogger("Backdrop", false);
  // }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center overflow-hidden bg-black/70"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;

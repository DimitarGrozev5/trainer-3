import { motion, motionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type Props = {
  scrollProgress: number;
  setScroll: (progress: number) => void;
  isTouching: boolean;
};

const Header: React.FC<Props> = ({ scrollProgress, setScroll, isTouching }) => {
  const headerHeight = useTransform(
    motionValue(scrollProgress),
    [0, 0.35],
    ["40vh", "4vh"]
  );

  const h1YOffset = useTransform(
    motionValue(scrollProgress),
    [0, 0.15],
    ["0rem", "0rem"]
  );

  const h1Opacity = useTransform(
    motionValue(scrollProgress),
    [0, 0.18],
    [1, 0]
  );

  const h2Opacity = useTransform(
    motionValue(scrollProgress),
    [0.18, 0.35],
    [0, 1]
  );

  // Reset scroll position when the user stop scrolling
  useEffect(() => {
    if (!isTouching) {
      if (scrollProgress <= 0.17) {
        setScroll(0);
      } else if (scrollProgress > 0.17 && scrollProgress < 0.35) {
        setScroll(0.35);
      }
    }
  }, [isTouching, scrollProgress, setScroll]);

  return (
    <motion.header
      className="flex flex-col items-center justify-center p-4 pt-0"
      style={{ height: headerHeight.get() }}
    >
      <motion.h1
        className="flex flex-1 items-center justify-center text-4xl font-bold text-gray-900"
        style={{ opacity: h1Opacity.get(), y: h1YOffset.get() }}
      >
        Trainer
      </motion.h1>
      <motion.h1
        className="self-start text-2xl font-bold text-gray-900"
        style={{ opacity: h2Opacity.get() }}
      >
        Trainer
      </motion.h1>
    </motion.header>
  );
};

export default Header;

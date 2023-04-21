import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useId } from "react-aria";

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  addSnapRequest: (id: string, test: () => boolean, to: () => number) => void;
  removeSnapRequest: (id: string) => void;
};

const Header: React.FC<Props> = ({
  containerRef,
  addSnapRequest,
  removeSnapRequest,
}) => {
  const headerId = useId();
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  // Setup header scroll progress
  const { scrollYProgress: headerScroll } = useScroll({
    container: containerRef,
    target: headerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  // useEffect(() => {
  //   return headerScroll.on("change", (latest) => {
  //     console.log(latest);
  //   });
  // }, [headerScroll]);

  // Setup header transition values
  const h2Opacity = useTransform(headerScroll, [0, 0.5, 1], [0, 0, 1]);
  const h1Opacity = useTransform(headerScroll, [0, 0.5, 1], [1, 0, 0]);
  const h1YOffset = useTransform(
    headerScroll,
    [0, 0.5, 1],
    ["0rem", "5rem", "5rem"]
  );

  // Add scroll progress for h2
  const h2Ref = useRef<HTMLHeadingElement | null>(null);
  const { scrollYProgress: h2Scroll } = useScroll({
    container: containerRef,
    target: h2Ref,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  // Toggle fixed h2 visibility
  const [h2Visibility, setH2Visibility] = useState<"hidden" | "visible">(
    "hidden"
  );
  useEffect(() => {
    return h2Scroll.on("change", (latest) => {
      if (latest > 0) {
        setH2Visibility("visible");
      } else {
        setH2Visibility("hidden");
      }
    });
  }, [h2Scroll]);

  // Setup margin bellow the header, to prevent content from being hidden bellow the fixed div
  const headerMargin = useTransform(h2Scroll, [0, 1], ["0rem", "3rem"]);

  // Setup header snapping
  useEffect(() => {
    const to = () => {
      if (!headerRef.current) return 0;
      const headerRect = headerRef.current.getBoundingClientRect();
      return headerRect.height;
    };

    addSnapRequest(
      headerId,
      () => headerScroll.get() > 0 && headerScroll.get() < 0.5,
      () => 0
    );
    addSnapRequest(
      headerId,
      () => headerScroll.get() >= 0.5 && headerScroll.get() < 1,
      to
    );

    return () => {
      removeSnapRequest(headerId);
    };
  }, [addSnapRequest, headerId, headerScroll, removeSnapRequest]);

  return (
    <motion.header
      ref={headerRef}
      className="z-50 flex flex-col items-stretch justify-center"
      style={{ height: "40vh", marginBottom: headerMargin }}
    >
      <motion.h1
        className="flex flex-1 items-center justify-center text-4xl font-bold text-gray-900"
        style={{ opacity: h1Opacity, y: h1YOffset }}
      >
        Trainer
      </motion.h1>

      <div className="flex items-center justify-between bg-gray-100">
        <motion.h2
          className="bg-gray-100 p-2 text-2xl font-bold text-gray-900"
          style={{ opacity: h2Opacity }}
          ref={h2Ref}
        >
          Trainer
        </motion.h2>
        <button className="mr-4 cursor-default rounded-full active:ring-2 active:ring-gray-300">
          <MoreVertIcon sx={{ fontSize: "1.8rem" }} />
        </button>
      </div>

      <div
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-gray-100"
        style={{ visibility: h2Visibility }}
      >
        <h2 className="flex-1 p-2 text-2xl font-bold text-gray-900">Trainer</h2>
        <button className="mr-4 cursor-default rounded-full active:ring-2 active:ring-gray-300">
          <MoreVertIcon sx={{ fontSize: "1.8rem" }} />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;

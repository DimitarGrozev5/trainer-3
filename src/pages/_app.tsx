import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { api } from "~/utils/api";

import "~/styles/globals.css";
// import Header from "~/components/layout/header";
import { motion, useScroll, useTransform } from "framer-motion";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  // Keep track when the user is touching the screen
  const [isTouching, setIsTouching] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollLocked = useMemo(
    () => isTouching || isAutoScrolling,
    [isAutoScrolling, isTouching]
  );

  // Function to animate scrolling
  const scrollTo = useCallback(
    (position: number) => {
      if (!scrollLocked) {
        containerRef.current?.scrollTo({
          top: position,
          behavior: "smooth",
        });
      }
    },
    [scrollLocked]
  );

  // Setup event listeners for touch events
  const touchStart = () => {
    setIsTouching(true);
    setIsAutoScrolling(true);
  };
  const touchEnd = () => {
    setIsTouching(false);
  };

  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const onScroll = () => {
    // Clear previous timeout
    clearTimeout(scrollTimeoutRef.current);

    // Add timeout to clear scroll state
    scrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(false);
    }, 30);
  };

  // Attach event listeners to container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", touchStart);
      container.addEventListener("touchend", touchEnd);
      container.addEventListener("scroll", onScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", touchStart);
        container.removeEventListener("touchend", touchEnd);
        container.removeEventListener("scroll", onScroll);
      }
    };
  }, []);

  // Setup header scroll progress
  const { scrollYProgress: headerScroll } = useScroll({
    container: containerRef,
    target: headerRef,
    offset: ["start start", "end start"],
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

  // Setup header snapping
  useEffect(() => {
    const headerScrollValue = headerScroll.get();

    if (!scrollLocked) {
      // Setup header snap points
      const header = headerRef.current;
      if (headerScrollValue < 0.5) {
        scrollTo(0);
      }
      if (header && headerScrollValue >= 0.5 && headerScrollValue < 1) {
        const headerRect = header.getBoundingClientRect();
        scrollTo(headerRect.height);
      }
    }
  }, [scrollLocked, headerScroll, scrollTo]);

  return (
    <SessionProvider session={session}>
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 top-0 overflow-auto bg-gray-100"
      >
        {/* <Header
          scrollProgress={scrollProgress}
          setScroll={setScroll}
          isTouching={isTouching}
        /> */}
        <motion.header
          ref={headerRef}
          className="flex flex-col items-stretch justify-center"
          style={{ height: "40vh" }}
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
            className="fixed left-0 right-0 top-0 flex items-center justify-between bg-gray-100"
            style={{ visibility: h2Visibility }}
          >
            <h2 className="flex-1 p-2 text-2xl font-bold text-gray-900">
              Trainer
            </h2>
            <button className="mr-4 cursor-default rounded-full active:ring-2 active:ring-gray-300">
              <MoreVertIcon sx={{ fontSize: "1.8rem" }} />
            </button>
          </div>
        </motion.header>
        <main className="flex min-h-screen flex-col items-stretch gap-4 overflow-y-auto p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

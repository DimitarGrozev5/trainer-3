import { useEffect, useRef, useState } from "react";
import { motion, useTransform, motionValue } from "framer-motion";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useVirtualScrollProgress } from "~/hooks/useVirtualScrollProgress";
import Header from "~/components/layout/header";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { containerRef, scrollProgress, setScroll } =
    useVirtualScrollProgress();

  useEffect(() => {
    console.log(scrollProgress);
  }, [scrollProgress]);

  // useEffect(() => {
  //   return headerHeight.on("change", (latest) => console.log(latest));
  // }, [headerHeight]);

  return (
    <SessionProvider session={session}>
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 top-0 overflow-hidden bg-gray-100"
      >
        <Header scrollProgress={scrollProgress} />
        <main className="overflow-y-hidden p-4" style={{ height: "60vh" }}>
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          test <br />
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

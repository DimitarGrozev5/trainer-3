import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";

import { api } from "~/utils/api";

import Header from "~/components/layout/header";
import { useGlobalScroll } from "~/hooks/useGlobalScroll";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { containerRef, addSnapRequest, removeSnapRequest } = useGlobalScroll();

  return (
    <SessionProvider session={session}>
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 top-0 overflow-auto bg-gray-100"
      >
        <Header
          containerRef={containerRef}
          addSnapRequest={addSnapRequest}
          removeSnapRequest={removeSnapRequest}
        />

        <main className="flex min-h-screen flex-col items-stretch gap-4 overflow-y-auto p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

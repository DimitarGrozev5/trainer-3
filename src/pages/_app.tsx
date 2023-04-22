import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "~/styles/globals.css";
import { SSRProvider } from "@react-aria/ssr";

import { api } from "~/utils/api";

import Header from "~/components/layout/header/header";
import { useGlobalScroll } from "~/hooks/useGlobalScroll";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { containerRef, addSnapRequest, removeSnapRequest } = useGlobalScroll();

  return (
    <SessionProvider session={session}>
      <SSRProvider>
        <div
          ref={containerRef}
          className="fixed bottom-0 left-0 right-0 top-0 overflow-auto scroll-smooth bg-gray-100"
        >
          <Header
            containerRef={containerRef}
            addSnapRequest={addSnapRequest}
            removeSnapRequest={removeSnapRequest}
          />

          <main className="flex min-h-screen flex-col items-stretch gap-4 overflow-y-auto px-4">
            <Component
              {...pageProps}
              containerRef={containerRef}
              addSnapRequest={addSnapRequest}
              removeSnapRequest={removeSnapRequest}
            />
          </main>
        </div>
      </SSRProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

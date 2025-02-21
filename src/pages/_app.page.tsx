import type { AppProps } from "next/app";
import { globalStyles } from "@/styles/global";
import { SessionProvider } from 'next-auth/react'
import '../lib/dayjs'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryCLient } from "@/lib/react-query";

globalStyles()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryCLient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

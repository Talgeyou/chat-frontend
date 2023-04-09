import type { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import '@/shared/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const primaryFont = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
});
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div className={primaryFont.className}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}

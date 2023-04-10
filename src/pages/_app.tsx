import type { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@/shared/styles/globals.css';

const queryClient = new QueryClient();

const primaryFont = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
});
function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
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

export default appWithTranslation(App);

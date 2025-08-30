import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="description" content="TripWiser - Your personal travel companion. Plan trips, pack smart, and capture memories." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tripwiser-web-lmgo.vercel.app/" />
        <meta property="og:title" content="TripWiser" />
        <meta property="og:description" content="Your personal travel companion. Plan trips, pack smart, and capture memories." />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tripwiser-web-lmgo.vercel.app/" />
        <meta property="twitter:title" content="TripWiser" />
        <meta property="twitter:description" content="Your personal travel companion. Plan trips, pack smart, and capture memories." />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/og-image.png" />
        
        {/* App Store Meta Tags */}
        <meta name="apple-itunes-app" content="app-id=MT98B5253F" />
        <meta name="google-play-app" content="app-id=com.tripwiser.android.app" />
        
        <title>TripWiser - Your Travel Companion</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}


import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LandingPage from '../components/LandingPage';

export default function HomePage() {
  const router = useRouter();
  
  // Extract path and query parameters from the URL
  const pathSegments = router.asPath.split('?')[0].split('/').filter(Boolean);
  const queryParams = router.query;
  
  // Determine the deeplink path from URL segments
  let deeplinkPath = '';
  if (pathSegments.length > 0) {
    deeplinkPath = pathSegments.join('/');
  }
  
  // Convert query parameters to the format expected by LandingPage
  const deeplinkParams = Object.keys(queryParams).reduce((acc, key) => {
    acc[key] = queryParams[key] as string;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <Head>
        <title>TripWiser - Your Travel Companion</title>
        <meta name="description" content="TripWiser - Your personal travel companion. Plan trips, pack smart, and capture memories." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tripwiser-web-lmgo.vercel.app/" />
        <meta property="og:title" content="TripWiser - Your Travel Companion" />
        <meta property="og:description" content="Your personal travel companion. Plan trips, pack smart, and capture memories." />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tripwiser-web-lmgo.vercel.app/" />
        <meta property="twitter:title" content="TripWiser - Your Travel Companion" />
        <meta property="twitter:description" content="Your personal travel companion. Plan trips, pack smart, and capture memories." />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
      </Head>
      
      <LandingPage 
        title="Welcome to TripWiser"
        description="Your personal travel companion"
        showDownloadButtons={true}
        deeplinkPath={deeplinkPath}
        deeplinkParams={deeplinkParams}
      />
    </>
  );
}


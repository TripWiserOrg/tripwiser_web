import React from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';

export default function HomePage() {
  // Updated: Added comment to trigger deployment with environment variables
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
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tripwiser-web-lmgo.vercel.app/" />
        <meta property="twitter:title" content="TripWiser - Your Travel Companion" />
        <meta property="twitter:description" content="Your personal travel companion. Plan trips, pack smart, and capture memories." />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/og-image.png" />
      </Head>
      
      <LandingPage 
        title="Welcome to TripWiser"
        description="Your personal travel companion"
        showDownloadButtons={true}
        deeplinkPath="trip/test123"
        deeplinkParams={{ viewOnly: 'true' }}
      />
    </>
  );
}


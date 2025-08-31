import React from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';
import ErrorBoundary from '../components/ErrorBoundary';

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Test Deep Links - TripWiser</title>
        <meta name="description" content="Test page for TripWiser deep linking functionality" />
      </Head>
      
      <ErrorBoundary>
        <LandingPage 
          title="Test Deep Links"
          description="Test the manual Open App button with different scenarios"
          showDownloadButtons={true}
          deeplinkPath="trip/test123"
          deeplinkParams={{ 
            viewOnly: 'true',
            testMode: 'true'
          }}
        />
      </ErrorBoundary>
    </>
  );
}

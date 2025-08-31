import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RedirectPage() {
  const router = useRouter();
  const [deeplinkUrl, setDeeplinkUrl] = useState<string>('');

  useEffect(() => {
    if (!router.isReady) return;

    // Get the full path including query parameters
    const path = router.asPath;
    const queryString = Object.keys(router.query)
      .filter(key => key !== 'slug') // Remove the slug parameter
      .map(key => `${key}=${router.query[key]}`)
      .join('&');

    // Build the deeplink URL
    const appUrl = `tripwiser://${path}${queryString ? '?' + queryString : ''}`;
    
    console.log('Simple redirect - Path:', path);
    console.log('Simple redirect - Query string:', queryString);
    console.log('Simple redirect - App URL:', appUrl);
    
    setDeeplinkUrl(appUrl);

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    
    if (isMobile) {
      console.log('Simple redirect - Mobile detected, redirecting to app');
      window.location.href = appUrl;
    } else {
      console.log('Simple redirect - Desktop detected, showing landing page');
    }
  }, [router.isReady, router.asPath, router.query]);

  const handleRedirect = () => {
    if (deeplinkUrl) {
      console.log('Simple redirect - Manual redirect to:', deeplinkUrl);
      window.location.href = deeplinkUrl;
    }
  };

  return (
    <>
      <Head>
        <title>TripWiser - Redirecting...</title>
        <meta name="description" content="Opening TripWiser app..." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              TripWiser
            </h1>
            <p className="text-gray-600">
              Your personal travel companion
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRedirect}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Open in TripWiser App
            </button>

            <div className="flex space-x-4">
              <a
                href="https://apps.apple.com/app/tripwiser/MT98B5253F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.tripwiser.android.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Google Play
              </a>
            </div>
          </div>

          {deeplinkUrl && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Debug URL:</p>
              <p className="text-xs font-mono text-gray-800 break-all">{deeplinkUrl}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  };
};

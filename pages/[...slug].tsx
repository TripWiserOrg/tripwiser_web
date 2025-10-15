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
        <title>TripWiser - Opening App</title>
        <meta name="description" content="Opening TripWiser app..." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center animate-fade-in">
          <div className="mb-8">
            <div className="mb-6 inline-block bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl">
              <svg className="w-16 h-16 text-blue-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              TripWiser
            </h1>
            <p className="text-gray-600 mb-4">
              Opening your content in the app
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full">
              <svg className="w-4 h-4 mr-2 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-blue-700 font-medium">Redirecting...</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                If you're not redirected within 3 seconds
              </p>
              <button
                onClick={handleRedirect}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium underline underline-offset-2 transition-colors"
              >
                Click here to open manually
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-700 font-medium mb-4">
                Don't have the app?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://apps.apple.com/app/tripwiser/MT98B5253F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.tripwiser.android.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
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

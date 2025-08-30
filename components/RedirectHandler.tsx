import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  parseUrlPath, 
  buildDeeplinkUrl, 
  attemptAppOpen, 
  detectPlatform,
  getPageTitle,
  getPageDescription,
  ENV_CONFIG
} from '../utils/deeplink';

interface RedirectHandlerProps {
  pathname: string;
  searchParams: Record<string, string>;
}

export default function RedirectHandler({ pathname, searchParams }: RedirectHandlerProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [debugUrl, setDebugUrl] = useState<string>('');
  const router = useRouter();

  const handleRedirect = async () => {
    console.log('RedirectHandler: Starting redirect process...');
    console.log('RedirectHandler: Pathname:', pathname);
    console.log('RedirectHandler: Search params:', searchParams);
    console.log('RedirectHandler: Environment config:', ENV_CONFIG);
    console.log('RedirectHandler: URL Scheme being used:', ENV_CONFIG.URL_SCHEME);

    try {
      // Parse the URL path
      const parsedPath = parseUrlPath(pathname);
      console.log('RedirectHandler: Parsed path result:', parsedPath);

      if (!parsedPath) {
        console.log('RedirectHandler: Invalid path, redirecting to home');
        router.push('/');
        return;
      }

      // Build the deep link URL
      const deeplinkUrl = buildDeeplinkUrl(
        `${parsedPath.type}/${parsedPath.id}`,
        { ...parsedPath.params, ...searchParams }
      );
      
      console.log('RedirectHandler: Built deeplink URL:', deeplinkUrl);
      setDebugUrl(deeplinkUrl);

      // Check if we're on mobile
      const platform = detectPlatform();
      console.log('RedirectHandler: Platform detected:', platform);

      if (platform === 'desktop') {
        console.log('RedirectHandler: Desktop detected, showing landing page');
        return;
      }

      setIsRedirecting(true);
      setRedirectAttempted(true);

      // Attempt to open the app
      console.log('RedirectHandler: Attempting to open app...');
      const appOpened = await attemptAppOpen(deeplinkUrl, 2000);

      if (appOpened) {
        console.log('RedirectHandler: App opened successfully!');
        // App opened, we can stay on this page or redirect
      } else {
        console.log('RedirectHandler: App did not open, showing fallback');
        // App didn't open, show fallback
      }

    } catch (error) {
      console.error('RedirectHandler: Error during redirect:', error);
      setIsRedirecting(false);
    }
  };

  useEffect(() => {
    const platform = detectPlatform();
    if (platform === 'desktop') return;

    console.log('RedirectHandler: AGGRESSIVE app opening attempts starting...');
    console.log('RedirectHandler: Deep link URL:', debugUrl);
    console.log('RedirectHandler: Environment config for aggressive attempts:', ENV_CONFIG);

    // Parse URL and build deeplink
    const parsedPath = parseUrlPath(pathname);
    if (!parsedPath) {
      console.log('RedirectHandler: Invalid path, not attempting app open');
      return;
    }

    const deeplinkUrl = buildDeeplinkUrl(
      `${parsedPath.type}/${parsedPath.id}`,
      { ...parsedPath.params, ...searchParams }
    );
    
    console.log('RedirectHandler: Built deeplink URL for aggressive attempts:', deeplinkUrl);
    setDebugUrl(deeplinkUrl);

    // Multiple aggressive attempts
    const attempts = [
      () => { 
        console.log('RedirectHandler: Attempt 1 - Immediate window.location.href');
        window.location.href = deeplinkUrl; 
      },
      () => { 
        console.log('RedirectHandler: Attempt 2 - Delayed window.location.href (100ms)');
        setTimeout(() => { window.location.href = deeplinkUrl; }, 100); 
      },
      () => { 
        console.log('RedirectHandler: Attempt 3 - Delayed window.location.href (500ms)');
        setTimeout(() => { window.location.href = deeplinkUrl; }, 500); 
      },
      () => { 
        console.log('RedirectHandler: Attempt 4 - Delayed window.location.href (1000ms)');
        setTimeout(() => { window.location.href = deeplinkUrl; }, 1000); 
      }
    ];

    // Execute attempts with delays
    attempts.forEach((attempt, index) => {
      if (index === 0) {
        attempt();
      } else {
        setTimeout(attempt, index * 200);
      }
    });

    // Final fallback with window.open
    setTimeout(() => {
      console.log('RedirectHandler: Final attempt - window.open');
      try {
        window.open(deeplinkUrl, '_self');
      } catch (error) {
        console.error('RedirectHandler: window.open failed:', error);
      }
    }, 1500);

  }, [pathname, searchParams]);

  // Call handleRedirect immediately
  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isRedirecting ? 'Opening TripWiser...' : 'TripWiser'}
          </h1>
          <p className="text-gray-600">
            {isRedirecting 
              ? 'Redirecting you to the TripWiser app...' 
              : 'Your personal travel companion'
            }
          </p>
        </div>

        {isRedirecting && (
          <div className="mb-6">
            <div className="spinner-small mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">
              If the app doesn't open automatically, please tap the button below
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleRedirect}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isRedirecting ? 'Try Again' : 'Open in TripWiser App'}
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

        {debugUrl && (
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Debug URL:</p>
            <p className="text-xs font-mono text-gray-800 break-all">{debugUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  parseUrlPath, 
  buildDeeplinkUrl, 
  detectPlatform,
  ENV_CONFIG
} from '../utils/deeplink';

interface RedirectHandlerProps {
  pathname: string;
  searchParams: Record<string, string>;
}

export default function RedirectHandler({ pathname, searchParams }: RedirectHandlerProps) {
  const [deeplinkUrl, setDeeplinkUrl] = useState<string>('');
  const hasAttemptedRedirect = useRef(false);
  const router = useRouter();

  // Parse URL and build deeplink once on mount
  useEffect(() => {
    if (hasAttemptedRedirect.current) return; // Prevent multiple attempts
    
    console.log('RedirectHandler: Starting redirect process...');
    console.log('RedirectHandler: Pathname:', pathname);
    console.log('RedirectHandler: Search params:', searchParams);

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
      const url = buildDeeplinkUrl(
        `${parsedPath.type}/${parsedPath.id}`,
        { ...parsedPath.params, ...searchParams }
      );
      
      console.log('RedirectHandler: Built deeplink URL:', url);
      setDeeplinkUrl(url);

      // Check if we're on mobile
      const platform = detectPlatform();
      console.log('RedirectHandler: Platform detected:', platform);

      if (platform === 'desktop') {
        console.log('RedirectHandler: Desktop detected, showing landing page');
        hasAttemptedRedirect.current = true;
        return;
      }

      // On mobile, attempt to open the app
      console.log('RedirectHandler: Mobile detected, attempting to open app...');
      hasAttemptedRedirect.current = true;
      
      // Simple redirect attempt
      window.location.href = url;

    } catch (error) {
      console.error('RedirectHandler: Error during redirect:', error);
      hasAttemptedRedirect.current = true;
    }
  }, [pathname, searchParams, router]);

  const handleManualRedirect = () => {
    if (deeplinkUrl) {
      console.log('RedirectHandler: Manual redirect to:', deeplinkUrl);
      window.location.href = deeplinkUrl;
    }
  };

  return (
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
            onClick={handleManualRedirect}
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
  );
}


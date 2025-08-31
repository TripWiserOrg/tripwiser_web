import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
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
    console.log('RedirectHandler: useEffect triggered');
    console.log('RedirectHandler: hasAttemptedRedirect.current:', hasAttemptedRedirect.current);
    
    if (hasAttemptedRedirect.current) {
      console.log('RedirectHandler: Already attempted redirect, skipping');
      return;
    }
    
    console.log('RedirectHandler: Starting redirect process...');
    console.log('RedirectHandler: Pathname:', pathname);
    console.log('RedirectHandler: Search params:', searchParams);
    console.log('RedirectHandler: Environment config:', ENV_CONFIG);

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
      console.log('RedirectHandler: Redirecting to:', url);
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
    } else {
      console.log('RedirectHandler: No deeplink URL available for manual redirect');
    }
  };

  console.log('RedirectHandler: Rendering component, deeplinkUrl:', deeplinkUrl);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/branding/login_bg.jpg"
          alt="TripWiser Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="card animate-fade-in bg-white bg-opacity-95 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <Image
                src="/branding/logo.png"
                alt="TripWiser Logo"
                width={60}
                height={60}
                className="mx-auto"
                priority
              />
            </div>
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
              className="w-full btn btn-primary btn-lg"
            >
              Open in TripWiser App
            </button>

            <div className="flex space-x-4">
              <a
                href="https://apps.apple.com/app/tripwiser/MT98B5253F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn btn-secondary"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.tripwiser.android.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn btn-primary"
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
    </div>
  );
}


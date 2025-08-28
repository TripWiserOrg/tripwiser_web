import React, { useEffect, useState } from 'react';
import { 
  attemptAppOpen, 
  buildDeeplinkUrl, 
  getStoreUrl, 
  detectPlatform,
  parseUrlPath,
  buildAppPath,
  DeeplinkParams 
} from '../utils/deeplink';
import LandingPage from './LandingPage';

interface RedirectHandlerProps {
  pathname: string;
  searchParams?: URLSearchParams;
}

export default function RedirectHandler({ pathname, searchParams }: RedirectHandlerProps) {
  const [isAttempting, setIsAttempting] = useState(true);
  const [hasApp, setHasApp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Parse the URL path
        const parsed = parseUrlPath(pathname);
        if (!parsed) {
          setError('Invalid URL');
          setIsAttempting(false);
          return;
        }

        // Build the app path
        const appPath = buildAppPath(parsed.type, parsed.id, parsed.params);
        if (!appPath) {
          setError('Invalid content type');
          setIsAttempting(false);
          return;
        }

        // Add query parameters
        const params: DeeplinkParams = { ...parsed.params };
        if (searchParams) {
          searchParams.forEach((value, key) => {
            params[key as keyof DeeplinkParams] = value;
          });
        }

        // Build the deeplink URL
        const deeplinkUrl = buildDeeplinkUrl(appPath, params);

        // Attempt to open the app
        const platform = detectPlatform();
        
        if (platform === 'desktop') {
          // On desktop, show the landing page immediately
          setIsAttempting(false);
          return;
        }

        // On mobile, attempt to open the app
        const appOpened = await attemptAppOpen(deeplinkUrl);
        
        if (appOpened) {
          setHasApp(true);
          // The app opened successfully, we can redirect to store after a delay
          setTimeout(() => {
            window.location.href = getStoreUrl();
          }, 3000);
        } else {
          setHasApp(false);
          // App didn't open, redirect to store after a delay
          setTimeout(() => {
            window.location.href = getStoreUrl();
          }, 2000);
        }
        
        setIsAttempting(false);
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Failed to open app');
        setIsAttempting(false);
      }
    };

    handleRedirect();
  }, [pathname, searchParams]);

  // Show loading state while attempting to open app
  if (isAttempting) {
    return (
      <LandingPage 
        title="Opening TripWiser..."
        description="Redirecting you to the app"
        showDownloadButtons={false}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <LandingPage 
        title="Oops!"
        description={error}
        showDownloadButtons={true}
      />
    );
  }

  // Show success state (app opened)
  if (hasApp) {
    return (
      <LandingPage 
        title="TripWiser Opened!"
        description="The app should have opened. If not, download it below."
        showDownloadButtons={true}
      />
    );
  }

  // Show fallback state (app not installed)
  return (
    <LandingPage 
      title="Download TripWiser"
      description="Get the app to view this content"
      showDownloadButtons={true}
    />
  );
}


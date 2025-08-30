import React, { useEffect, useState } from 'react';
import { 
  attemptAppOpen, 
  buildDeeplinkUrl, 
  getStoreUrl, 
  detectPlatform,
  parseUrlPath,
  buildAppPath,
  getPageTitle,
  getPageDescription,
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
  const [deeplinkPath, setDeeplinkPath] = useState<string>('');
  const [deeplinkParams, setDeeplinkParams] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState<string>('TripWiser');
  const [pageDescription, setPageDescription] = useState<string>('Your personal travel companion');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        console.log('RedirectHandler: Starting redirect for pathname:', pathname);
        
        // Parse the URL path
        const parsed = parseUrlPath(pathname);
        console.log('RedirectHandler: Parsed URL:', parsed);
        
        if (!parsed) {
          // Even if URL is invalid, we'll still show the landing page with manual button
          console.log('RedirectHandler: Invalid URL, showing landing page with manual button');
          setPageTitle('TripWiser');
          setPageDescription('Your personal travel companion');
          setIsAttempting(false);
          return;
        }

        // Set page title and description
        const title = getPageTitle(parsed.type, parsed.id);
        const description = getPageDescription(parsed.type, parsed.id);
        setPageTitle(title);
        setPageDescription(description);

        // Build the app path
        const appPath = buildAppPath(parsed.type, parsed.id, parsed.params);
        if (!appPath) {
          console.log('RedirectHandler: Invalid content type, showing landing page with manual button');
          setPageTitle('TripWiser');
          setPageDescription('Your personal travel companion');
          setIsAttempting(false);
          return;
        }

        // Add query parameters
        const params: DeeplinkParams = { ...parsed.params };
        if (searchParams) {
          searchParams.forEach((value, key) => {
            params[key] = value;
          });
        }

        // Store deeplink info for the button
        setDeeplinkPath(appPath);
        setDeeplinkParams(params);

        // Build the deeplink URL
        const deeplinkUrl = buildDeeplinkUrl(appPath, params);
        console.log('RedirectHandler: Built deeplink URL:', deeplinkUrl);

        // Detect platform
        const platform = detectPlatform();
        console.log('RedirectHandler: Detected platform:', platform);
        
        if (platform === 'desktop') {
          // On desktop, show the landing page immediately
          setIsAttempting(false);
          return;
        }

        // On mobile, immediately try to open the app
        console.log('RedirectHandler: Immediately attempting to open app with URL:', deeplinkUrl);
        
        // Try to open the app immediately
        try {
          const appOpened = await attemptAppOpen(deeplinkUrl, 1500);
          
          if (appOpened) {
            console.log('RedirectHandler: App opened successfully');
            setHasApp(true);
          } else {
            console.log('RedirectHandler: App not installed or failed to open');
            setHasApp(false);
          }
        } catch (err) {
          console.error('RedirectHandler: Error opening app:', err);
          setHasApp(false);
        }
        
        setIsAttempting(false);
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Failed to open app');
        setIsAttempting(false);
      }
    };

    // Execute immediately
    handleRedirect();
  }, [pathname, searchParams]);

  // Immediate app opening attempt for mobile devices - MULTIPLE ATTEMPTS
  useEffect(() => {
    const platform = detectPlatform();
    if (platform === 'desktop') return;

    // Parse the URL immediately
    const parsed = parseUrlPath(pathname);
    if (!parsed) return;

    const appPath = buildAppPath(parsed.type, parsed.id, parsed.params);
    if (!appPath) return;

    // Add query parameters
    const params: DeeplinkParams = { ...parsed.params };
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    const deeplinkUrl = buildDeeplinkUrl(appPath, params);
    
    console.log('RedirectHandler: AGGRESSIVE app opening attempts starting...');
    console.log('RedirectHandler: Deep link URL:', deeplinkUrl);
    
    // Multiple attempts to open the app
    const attempts = [
      () => {
        console.log('RedirectHandler: Attempt 1 - Immediate redirect');
        window.location.href = deeplinkUrl;
      },
      () => {
        console.log('RedirectHandler: Attempt 2 - After 100ms');
        setTimeout(() => {
          window.location.href = deeplinkUrl;
        }, 100);
      },
      () => {
        console.log('RedirectHandler: Attempt 3 - After 500ms');
        setTimeout(() => {
          window.location.href = deeplinkUrl;
        }, 500);
      },
      () => {
        console.log('RedirectHandler: Attempt 4 - After 1000ms');
        setTimeout(() => {
          window.location.href = deeplinkUrl;
        }, 1000);
      }
    ];

    // Execute all attempts
    attempts.forEach((attempt, index) => {
      if (index === 0) {
        // First attempt immediately
        attempt();
      } else {
        // Subsequent attempts with delays
        setTimeout(attempt, index * 200);
      }
    });

    // Also try using window.open as a fallback
    setTimeout(() => {
      console.log('RedirectHandler: Attempt 5 - Using window.open');
      try {
        window.open(deeplinkUrl, '_self');
      } catch (error) {
        console.error('RedirectHandler: window.open failed:', error);
      }
    }, 1500);

  }, [pathname, searchParams]);

  // Show loading state while attempting to open app
  if (isAttempting) {
    return (
      <LandingPage 
        title={pageTitle}
        description={pageDescription}
        showDownloadButtons={false}
        deeplinkPath={deeplinkPath}
        deeplinkParams={deeplinkParams}
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
        deeplinkPath={deeplinkPath}
        deeplinkParams={deeplinkParams}
      />
    );
  }

  // Show success state (app opened)
  if (hasApp) {
    return (
      <LandingPage 
        title={pageTitle}
        description="The app should have opened. If not, download it below."
        showDownloadButtons={true}
        deeplinkPath={deeplinkPath}
        deeplinkParams={deeplinkParams}
      />
    );
  }

  // Show fallback state (app not installed) - Always show manual button
  return (
    <LandingPage 
      title={pageTitle}
      description={pageDescription}
      showDownloadButtons={true}
      deeplinkPath={deeplinkPath}
      deeplinkParams={deeplinkParams}
    />
  );
}


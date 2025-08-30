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

        // On mobile, try to open the app with timeout
        console.log('RedirectHandler: Attempting to open app with URL:', deeplinkUrl);
        
        try {
          const appOpened = await attemptAppOpen(deeplinkUrl, 2000);
          
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

    handleRedirect();
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


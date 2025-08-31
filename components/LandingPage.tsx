import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { debug } from '../utils/debug';

interface LandingPageProps {
  title?: string;
  description?: string;
  showDownloadButtons?: boolean;
  deeplinkPath?: string;
  deeplinkParams?: any;
}

export default function LandingPage({ 
  title = "TripWiser", 
  description = "Your personal travel companion",
  showDownloadButtons = true,
  deeplinkPath,
  deeplinkParams
}: LandingPageProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [debugUrl, setDebugUrl] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
    setDebugInfo('Component mounted on client side');
    debug.log('LandingPage component mounted', { isClient: true, isVercel: debug.isVercel() });
    
    // Add error listeners for debugging
    const handleError = (event: ErrorEvent) => {
      debug.error('Unhandled error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      debug.error('Unhandled promise rejection', {
        reason: event.reason,
        promise: event.promise
      });
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const detectPlatform = (): 'ios' | 'android' | 'desktop' => {
    if (!isClient) return 'desktop';
    
    try {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setDebugInfo(`User Agent: ${userAgent}`);
      
      if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
      } else if (/android/.test(userAgent)) {
        return 'android';
      }
      
      return 'desktop';
    } catch (err) {
      setError(`Platform detection error: ${err}`);
      return 'desktop';
    }
  };

  const handleOpenApp = () => {
    setError(''); // Clear previous errors
    setDebugInfo('Button clicked - starting app opening process');
    debug.log('Open App button clicked', { deeplinkPath, deeplinkParams });
    
    // Use provided deeplinkPath or default to a test path
    const pathToUse = deeplinkPath || 'trip/test123';
    const paramsToUse = deeplinkParams || { viewOnly: 'true' };
    
    setIsOpening(true);
    
    try {
      // Build the deeplink URL
      const queryString = Object.entries(paramsToUse)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      const deeplinkUrl = `tripwiser://${pathToUse}${queryString ? '?' + queryString : ''}`;
      setDebugUrl(deeplinkUrl);
      
      // Production-safe logging
      if (typeof window !== 'undefined') {
        console.log('Opening app with URL:', deeplinkUrl);
        // Also log to a global variable for debugging
        (window as any).lastDeeplinkUrl = deeplinkUrl;
      }
      
      debug.log('Generated deeplink URL', { deeplinkUrl, platform: detectPlatform() });
      setDebugInfo(`Generated deeplink: ${deeplinkUrl}`);
      
      const platform = detectPlatform();
      setDebugInfo(`Platform detected: ${platform}`);
      
      if (platform === 'desktop') {
        setDebugInfo('Desktop platform - showing success message');
        // On desktop, just show the button was clicked
        setTimeout(() => {
          setIsOpening(false);
          setDebugInfo('Desktop flow completed');
        }, 1000);
        return;
      }
      
      // On mobile, attempt to open the app
      setDebugInfo(`Attempting to open app on ${platform}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = deeplinkUrl;
      }
      
      // Reset after a delay
      setTimeout(() => {
        setIsOpening(false);
        setDebugInfo('Mobile app opening attempt completed');
      }, 2000);
      
    } catch (error) {
      const errorMsg = `Error opening app: ${error}`;
      console.error(errorMsg);
      debug.error('Error in handleOpenApp', error);
      setError(errorMsg);
      setDebugInfo(`Error occurred: ${error}`);
      setIsOpening(false);
    }
  };

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
          <div className="text-center mb-8">
            <div className="mb-6">
              <Image
                src="/branding/logo.png"
                alt="TripWiser Logo"
                width={80}
                height={80}
                className="mx-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Manual Open App Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleOpenApp}
              disabled={isOpening}
              className={`btn btn-primary btn-lg mb-4 ${isOpening ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isOpening ? (
                <>
                  <div className="spinner-small mr-2"></div>
                  Opening...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {deeplinkPath ? 'Open in TripWiser App' : 'Test Open App'}
                </>
              )}
            </button>
            <p className="text-sm text-gray-500">
              {isClient ? (detectPlatform() === 'desktop' ? 'Click to open TripWiser app' : 'Tap to open TripWiser app') : 'Loading...'}
            </p>
            
            {/* Debug Information Display */}
            {(debugUrl || debugInfo || error) && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Debug Information:</p>
                
                {error && (
                  <p className="text-xs text-red-600 mb-2">Error: {error}</p>
                )}
                
                {debugInfo && (
                  <p className="text-xs text-blue-600 mb-2">Info: {debugInfo}</p>
                )}
                
                {debugUrl && (
                  <>
                    <p className="text-xs text-gray-600 mb-2">Debug URL:</p>
                    <p className="text-xs font-mono text-gray-800 break-all">{debugUrl}</p>
                  </>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Client: {isClient ? 'Yes' : 'No'} | Platform: {isClient ? detectPlatform() : 'Unknown'}
                </p>
              </div>
            )}
          </div>

          {/* Download Buttons */}
          {showDownloadButtons && (
            <div className="space-y-4">
              <p className="text-center text-gray-500 text-sm">
                Don't have the app? Download it now:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.tripwiser.android.app"
                  className="btn btn-primary flex-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Get it on Google Play
                </a>
                
                <a 
                  href="https://apps.apple.com/app/tripwiser/MT98B5253F"
                  className="btn btn-secondary flex-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  Download on App Store
                </a>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Plan trips with detailed itineraries
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Smart packing lists
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Capture travel memories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


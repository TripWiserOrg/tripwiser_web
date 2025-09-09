import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { parseAffiliateUrl, generateAppDeepLink, validateAffiliateData, detectPlatform, getAppStoreUrl, openAppWithFallback, trackAffiliateClick, AffiliateData } from '../utils/affiliate';

export default function RegisterPage() {
  const router = useRouter();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>('');
  const [isOpening, setIsOpening] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasAttemptedAutoOpen, setHasAttemptedAutoOpen] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Parse affiliate data from URL
  useEffect(() => {
    if (isClient && router.isReady) {
      const currentUrl = window.location.href;
      const parsed = parseAffiliateUrl(currentUrl);
      
      if (parsed && validateAffiliateData(parsed)) {
        setAffiliateData(parsed);
        const deepLink = generateAppDeepLink(parsed);
        setDeepLinkUrl(deepLink);
      } else {
        // Regular registration
        const deepLink = generateAppDeepLink(null);
        setDeepLinkUrl(deepLink);
      }
    }
  }, [isClient, router.isReady]);

  // Auto-open app when component mounts (only on mobile and if we have affiliate data)
  useEffect(() => {
    if (isClient && !hasAttemptedAutoOpen && deepLinkUrl) {
      const platform = detectPlatform();
      if (platform !== 'desktop') {
        setHasAttemptedAutoOpen(true);
        // Small delay to ensure the page is fully loaded
        setTimeout(() => {
          openApp();
        }, 500);
      }
    }
  }, [isClient, hasAttemptedAutoOpen, deepLinkUrl]);

  const openApp = () => {
    setIsOpening(true);
    
    try {
      // Track affiliate click
      trackAffiliateClick(affiliateData);
      
      const platform = detectPlatform();
      
      if (platform === 'desktop') {
        // On desktop, just show the button was clicked
        setTimeout(() => {
          setIsOpening(false);
        }, 1000);
        return;
      }
      
      // On mobile, use advanced app detection with fallback
      if (typeof window !== 'undefined' && deepLinkUrl) {
        openAppWithFallback(deepLinkUrl);
      }
      
      // Reset after a delay
      setTimeout(() => {
        setIsOpening(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error opening app:', error);
      setIsOpening(false);
    }
  };

  const handleOpenApp = () => {
    openApp();
  };

  const handleDownloadApp = () => {
    const platform = detectPlatform();
    const storeUrl = getAppStoreUrl(platform === 'ios' ? 'ios' : 'android');
    window.open(storeUrl, '_blank');
  };

  const getPageTitle = () => {
    if (affiliateData?.type === 'elite') {
      return 'TripWiser Elite - Join Now';
    } else if (affiliateData?.type === 'influencer') {
      return 'TripWiser - Welcome!';
    }
    return 'TripWiser - Join Now';
  };

  const getPageDescription = () => {
    if (affiliateData?.type === 'elite') {
      return 'Get 1 year of Elite plan FREE! Unlock unlimited trip planning and premium features.';
    } else if (affiliateData?.type === 'influencer') {
      return 'You were referred by one of our amazing creators. Start planning your next adventure!';
    }
    return 'Join TripWiser and start planning your next adventure with our travel companion app.';
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tripwiser-web-lmgo.vercel.app/register" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tripwiser-web-lmgo.vercel.app/register" />
        <meta property="twitter:title" content={getPageTitle()} />
        <meta property="twitter:description" content={getPageDescription()} />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
        
        {/* App Store Meta Tags */}
        <meta name="apple-itunes-app" content="app-id=MT98B5253F" />
        <meta name="google-play-app" content="app-id=com.tripwiser.android.app" />
      </Head>
      
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TripWiser!</h1>
              <p className="text-gray-600">Your personal travel companion</p>
            </div>

            {/* Elite Gift Banner */}
            {affiliateData?.type === 'elite' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">🎉 You're getting 1 year of Elite plan FREE!</h2>
                  <p className="text-sm opacity-90">
                    Unlock unlimited trip planning, advanced AI features, and premium support.
                  </p>
                </div>
              </div>
            )}

            {/* Influencer Banner */}
            {affiliateData?.type === 'influencer' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg text-white">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">👋 Welcome! You were referred by one of our amazing creators</h2>
                  <p className="text-sm opacity-90">
                    Start planning your next adventure with our free features.
                  </p>
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download the TripWiser App</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the best travel planning experience on your mobile device.
              </p>

              <button
                onClick={handleOpenApp}
                disabled={isOpening}
                className={`btn btn-primary btn-lg mb-4 w-full ${isOpening ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                    Open TripWiser App
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadApp}
                className="btn btn-secondary w-full mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download App
              </button>

              <p className="text-sm text-gray-500">
                {isClient ? (detectPlatform() === 'desktop' ? 'Click to open TripWiser app' : 'Tap to open TripWiser app') : 'Loading...'}
              </p>
            </div>

            {/* Debug Information */}
            {deepLinkUrl && (
              <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Debug Deep Link:</p>
                <p className="text-xs font-mono text-gray-800 break-all">{deepLinkUrl}</p>
                {affiliateData && (
                  <>
                    <p className="text-xs text-gray-600 mb-2 mt-2">Affiliate Data:</p>
                    <p className="text-xs font-mono text-gray-800 break-all">
                      {JSON.stringify(affiliateData, null, 2)}
                    </p>
                  </>
                )}
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
                {affiliateData?.type === 'elite' && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold text-purple-600">Elite features included!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

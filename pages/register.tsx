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
        // Longer delay to ensure the page is fully loaded and user sees the content
        setTimeout(() => {
          openApp();
        }, 2000);
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
        <meta name="apple-itunes-app" content="app-id=6751107025" />
        <meta name="google-play-app" content="app-id=com.tripwiser.android.app" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
            {/* Logo and Brand */}
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl">
                  <Image
                    src="/branding/logo.png"
                    alt="TripWiser Logo"
                    width={100}
                    height={100}
                    className="mx-auto"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Welcome to TripWiser!</h1>
              <p className="text-lg text-gray-600">Your personal travel companion</p>
            </div>

            {/* Elite Gift Banner */}
            {affiliateData?.type === 'elite' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h2 className="text-2xl font-bold mb-2">1 Year of Elite Plan FREE!</h2>
                  <p className="text-sm opacity-95">
                    Unlock unlimited trip planning, advanced AI features, and premium support.
                  </p>
                </div>
              </div>
            )}

            {/* Influencer Banner */}
            {affiliateData?.type === 'influencer' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl text-white shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-3">👋</div>
                  <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                  <p className="text-sm opacity-95">
                    You were referred by one of our amazing creators. Start planning your next adventure!
                  </p>
                </div>
              </div>
            )}

            {/* Auto-redirect message */}
            {hasAttemptedAutoOpen && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-center text-blue-700">
                  <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium">Opening TripWiser app...</span>
                </div>
              </div>
            )}

            {/* Subtle Manual Open Button */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-3">
                If you're not redirected within 3 seconds
              </p>
              <button
                onClick={handleOpenApp}
                disabled={isOpening}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium underline underline-offset-2 transition-colors disabled:opacity-50"
              >
                {isOpening ? 'Opening...' : 'Click here to open manually'}
              </button>
            </div>

            {/* Download Buttons */}
            <div className="space-y-6 mb-8">
              <div className="text-center">
                <p className="text-gray-700 font-medium mb-1">
                  Don't have the app yet?
                </p>
                <p className="text-sm text-gray-500">
                  Download TripWiser to start your travel journey
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://apps.apple.com/us/app/tripwiser-social-travel/id6751107025"
                  className="flex-1 flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-medium transition-all hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-base font-semibold">App Store</div>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.tripwiser.android.app"
                  className="flex-1 flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-medium transition-all hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">GET IT ON</div>
                    <div className="text-base font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-center text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                {affiliateData?.type === 'elite' ? 'Elite Features Included' : 'Everything you need to travel smart'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Detailed Itineraries</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Smart Packing Lists</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${affiliateData?.type === 'elite' ? 'bg-purple-100' : 'bg-purple-100'}`}>
                    <svg className={`w-6 h-6 ${affiliateData?.type === 'elite' ? 'text-purple-600' : 'text-purple-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {affiliateData?.type === 'elite' ? '✨ Premium Features' : 'Travel Memories'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

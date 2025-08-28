import React from 'react';
import { APP_CONFIG, buildDeeplinkUrl, detectPlatform } from '../utils/deeplink';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Loading State */}
          <div className="text-center mb-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 animate-pulse">Opening TripWiser...</p>
          </div>

          {/* Open App Button */}
            <div className="text-center mb-6">
              <button
                onClick={() => {
                  const deeplinkUrl = buildDeeplinkUrl(deeplinkPath || "sacha", deeplinkParams);
                  console.log('Opening app with URL:', deeplinkUrl);
                  window.location.href = deeplinkUrl;
                }}
                className="btn btn-primary btn-lg mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Open in TripWiser App
              </button>
              <p className="text-sm text-gray-500">
                {detectPlatform() === 'desktop' ? 'Click to open TripWiser app' : 'Tap to open TripWiser app'}
              </p>
            </div>

          {/* Download Buttons */}
          {showDownloadButtons && (
            <div className="space-y-4">
              <p className="text-center text-gray-500 text-sm">
                Don't have the app? Download it now:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={APP_CONFIG.androidStoreUrl}
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
                  href={APP_CONFIG.iosStoreUrl}
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


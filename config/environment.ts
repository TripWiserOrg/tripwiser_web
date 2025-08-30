// TripWiser Deeplink Website Environment Configuration
// Environment variables for Vercel deployment

export const ENV_CONFIG = {
  // App URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://tripwiser-web-lmgo.vercel.app/',
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tripwiser-backend.onrender.com',
  
  // App Store URLs
  ANDROID_STORE_URL: process.env.NEXT_PUBLIC_ANDROID_STORE_URL || 'https://play.google.com/store/apps/details?id=com.tripwiser.android.app',
  IOS_STORE_URL: process.env.NEXT_PUBLIC_IOS_STORE_URL || 'https://apps.apple.com/app/tripwiser/MT98B5253F',
  
  // App Configuration
  ANDROID_PACKAGE: process.env.NEXT_PUBLIC_ANDROID_PACKAGE || 'com.tripwiser.android.app',
  IOS_BUNDLE_ID: process.env.NEXT_PUBLIC_IOS_BUNDLE_ID || 'com.tripwiser.app',
  URL_SCHEME: process.env.NEXT_PUBLIC_URL_SCHEME || 'tripwiser://',
  
  // Analytics (Optional)
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

// Required configuration check
export function validateConfig() {
  const required = [
    'APP_URL',
    'ANDROID_STORE_URL',
    'IOS_STORE_URL',
    'ANDROID_PACKAGE',
    'IOS_BUNDLE_ID',
    'URL_SCHEME'
  ];
  
  const missing = required.filter(key => !ENV_CONFIG[key as keyof typeof ENV_CONFIG]);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    console.warn('Please set the following environment variables in Vercel:');
    missing.forEach(key => {
      console.warn(`  NEXT_PUBLIC_${key}`);
    });
  }
  
  return missing.length === 0;
}

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('Environment Configuration:', ENV_CONFIG);
}


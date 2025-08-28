// TripWiser Deeplink Website Environment Configuration
// Update these values with your actual configuration

export const ENV_CONFIG = {
  // App URLs
  APP_URL:'https://tripwiser-web-lmgo.vercel.app/',
  BACKEND_URL: 'https://tripwiser-backend.onrender.com',
  
  // App Store URLs (Update with your actual URLs)
  ANDROID_STORE_URL: 'https://play.google.com/store/apps/details?id=com.tripwiser.android.app',
  IOS_STORE_URL: 'https://apps.apple.com/app/tripwiser/MT98B5253F', // Replace with your actual App Store ID
  
  // App Configuration
  ANDROID_PACKAGE: 'com.tripwiser.android.app',
  IOS_BUNDLE_ID: 'com.tripwiser.app',
  URL_SCHEME: 'tripwiser://',
  
  // // Analytics (Optional)
  // GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  // FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  
  // Environment
  NODE_ENV: 'development',
  IS_PRODUCTION: true,
  IS_DEVELOPMENT: false,
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
    console.warn('Please update the configuration in config/environment.ts');
  }
  
  return missing.length === 0;
}


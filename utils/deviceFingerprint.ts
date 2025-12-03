export interface DeviceFingerprint {
  platform: 'iOS' | 'Android' | 'Web';
  timezone: string;
}

/**
 * Generates a simplified device fingerprint for attribution matching
 * Uses only platform and timezone for better reliability across browser/app
 * Backend automatically adds IP hash as the third matching component
 *
 * IMPORTANT: Platform values are standardized across the system:
 * - 'iOS' (exact case) - for iPad, iPhone, iPod
 * - 'Android' (exact case) - for Android devices
 * - 'Web' (exact case) - for desktop/other browsers
 * DO NOT change these values - they must match mobile app values for fingerprint matching
 */
export function generateDeviceFingerprint(): DeviceFingerprint {
  const userAgent = navigator.userAgent || '';

  // Detect platform - MUST use exact values: 'iOS', 'Android', 'Web'
  const platform = /iPad|iPhone|iPod/.test(userAgent)
    ? 'iOS'
    : /android/i.test(userAgent)
    ? 'Android'
    : 'Web';

  // Get timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

  console.log('📱 Device fingerprint:', { platform, timezone });

  return {
    platform,
    timezone,
  };
}

/**
 * Detects if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  const userAgent = navigator.userAgent || '';
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

/**
 * Gets the appropriate store URL based on platform
 */
export function getStoreURL(platform: 'iOS' | 'Android' | 'Web'): string {
  if (platform === 'iOS') {
    return 'https://apps.apple.com/us/app/tripwiser-social-travel/id6751107025';
  } else if (platform === 'Android') {
    return 'https://play.google.com/store/apps/details?id=com.tripwiser.android.app';
  }
  // Fallback to a landing page or generic store link
  return 'https://tripwiser-web-lmgo.vercel.app/';
}

export interface DeviceFingerprint {
  platform: 'iOS' | 'Android' | 'Web';
  osVersion: string;
  deviceModel: string;
  screenResolution: string;
  timezone: string;
  language: string;
  userAgent?: string;
}

/**
 * Generates a device fingerprint from browser/device information
 * This should match the fingerprint generation logic in the mobile app
 */
export function generateDeviceFingerprint(): DeviceFingerprint {
  const userAgent = navigator.userAgent || '';

  // Detect platform
  let platform: 'iOS' | 'Android' | 'Web' = 'Web';
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    platform = 'iOS';
  } else if (/Android/.test(userAgent)) {
    platform = 'Android';
  }

  // Extract OS version
  let osVersion = 'Unknown';
  if (platform === 'iOS') {
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      osVersion = `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`;
    }
  } else if (platform === 'Android') {
    const match = userAgent.match(/Android (\d+\.?\d*\.?\d*)/);
    if (match) {
      osVersion = match[1];
    }
  }

  // Extract device model (approximation)
  let deviceModel = 'Unknown';
  if (platform === 'iOS') {
    if (userAgent.includes('iPhone')) deviceModel = 'iPhone';
    else if (userAgent.includes('iPad')) deviceModel = 'iPad';
    else if (userAgent.includes('iPod')) deviceModel = 'iPod';
  } else if (platform === 'Android') {
    const match = userAgent.match(/Android.*;\s([^)]+)\)/);
    if (match) {
      deviceModel = match[1].trim();
    }
  }

  // Screen resolution
  const screenResolution = `${window.screen.width}x${window.screen.height}`;

  // Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

  // Language
  const language = navigator.language || (navigator as any).languages?.[0] || 'en-US';

  return {
    platform,
    osVersion,
    deviceModel,
    screenResolution,
    timezone,
    language,
    userAgent,
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

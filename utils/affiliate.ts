/**
 * Affiliate link parsing and deep link generation utilities
 */

export interface AffiliateData {
  type: 'elite' | 'influencer' | null;
  linkId?: string;
  influencerId?: string;
}

/**
 * Parse affiliate URL parameters
 */
export function parseAffiliateUrl(url: string): AffiliateData | null {
  try {
    const urlObj = new URL(url);
    const affiliate = urlObj.searchParams.get("affiliate");
    const linkId = urlObj.searchParams.get("linkId");
    const influencerId = urlObj.searchParams.get("id");

    if (affiliate === "elite") {
      return {
        type: "elite",
        linkId: linkId || undefined,
      };
    }

    if (affiliate === "influencer") {
      return {
        type: "influencer",
        influencerId: influencerId || undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing affiliate URL:', error);
    return null;
  }
}

/**
 * Generate deep link for mobile app based on affiliate data
 */
export function generateAppDeepLink(affiliateData: AffiliateData | null): string {
  const baseAppUrl = "tripwiser://register";

  if (!affiliateData) {
    return baseAppUrl; // Regular registration
  }

  const params = new URLSearchParams();

  if (affiliateData.type === "elite") {
    params.append("affiliateType", "elite");
    if (affiliateData.linkId) {
      params.append("linkId", affiliateData.linkId);
    }
  } else if (affiliateData.type === "influencer") {
    params.append("affiliateType", "influencer");
    if (affiliateData.influencerId) {
      params.append("influencerId", affiliateData.influencerId);
    }
  }

  return `${baseAppUrl}?${params.toString()}`;
}

/**
 * Validate affiliate data
 */
export function validateAffiliateData(affiliateData: AffiliateData | null): boolean {
  if (!affiliateData) return true; // Regular registration is valid

  if (affiliateData.type === "elite") {
    // Elite links are valid with or without linkId
    return true;
  }

  if (affiliateData.type === "influencer") {
    // Influencer links require influencerId
    return !!affiliateData.influencerId;
  }

  return false; // Invalid affiliate type
}

/**
 * Get platform-specific app store URL
 */
export function getAppStoreUrl(platform: 'ios' | 'android'): string {
  if (platform === 'ios') {
    return "https://apps.apple.com/us/app/tripwiser-social-travel/id6751107025";
  } else {
    return "https://play.google.com/store/apps/details?id=com.tripwiser.android.app";
  }
}

/**
 * Detect user platform
 */
export function detectPlatform(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/android/.test(userAgent)) {
    return 'android';
  }
  
  return 'desktop';
}

/**
 * Advanced app opening with fallback detection
 */
export function openAppWithFallback(deepLink: string): void {
  const platform = detectPlatform();

  if (platform === 'ios') {
    // iOS app detection
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // Set a flag when page becomes hidden (app is opening)
    let appOpened = false;
    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        appOpened = true;
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    // Fallback to App Store if app doesn't open
    setTimeout(() => {
      document.removeEventListener('visibilitychange', visibilityHandler);
      document.body.removeChild(iframe);

      if (!appOpened) {
        window.location.href = getAppStoreUrl('ios');
      }
    }, 2500);
  } else if (platform === 'android') {
    // Android app detection
    let appOpened = false;

    // Try to open the app
    window.location.href = deepLink;

    // Track if page becomes hidden (app is opening)
    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        appOpened = true;
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    // Fallback to Play Store after delay if app doesn't open
    setTimeout(() => {
      document.removeEventListener('visibilitychange', visibilityHandler);

      if (!appOpened && document.visibilityState === 'visible') {
        window.location.href = getAppStoreUrl('android');
      }
    }, 2500);
  } else {
    // Desktop - show QR code or direct to app store
    console.log('Desktop detected - deep link:', deepLink);
    // For desktop, we could show a QR code or just redirect to app store
    window.open(getAppStoreUrl('ios'), '_blank');
  }
}

/**
 * Track affiliate click for analytics
 */
export function trackAffiliateClick(affiliateData: AffiliateData | null): void {
  if (typeof window === 'undefined') return;
  
  if (affiliateData) {
    // Google Analytics example
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'affiliate_click', {
        affiliate_type: affiliateData.type,
        link_id: affiliateData.linkId,
        influencer_id: affiliateData.influencerId,
      });
    }
    
    // Console log for debugging
    console.log('Affiliate click tracked:', {
      type: affiliateData.type,
      linkId: affiliateData.linkId,
      influencerId: affiliateData.influencerId,
    });
  }
}

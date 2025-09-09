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
    return "https://apps.apple.com/app/tripwiser/MT98B5253F";
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
    const startTime = Date.now();
    
    // Try to open the app
    window.location.href = deepLink;
    
    // Check if app opened (iOS will pause the page)
    setTimeout(() => {
      const timeDiff = Date.now() - startTime;
      if (timeDiff < 2000) {
        // App likely opened, page was paused
        return;
      } else {
        // App didn't open, redirect to App Store
        window.location.href = getAppStoreUrl('ios');
      }
    }, 1500);
  } else if (platform === 'android') {
    // Android app detection - use simpler approach
    try {
      // Try to open the app directly
      window.location.href = deepLink;
      
      // Fallback after delay if app doesn't open
      setTimeout(() => {
        // Only redirect if we're still on the same page
        if (document.visibilityState === 'visible') {
          window.location.href = getAppStoreUrl('android');
        }
      }, 2500);
    } catch (error) {
      // If direct redirect fails, go to app store
      window.location.href = getAppStoreUrl('android');
    }
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

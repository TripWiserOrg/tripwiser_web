export interface DeeplinkParams {
  tripId?: string;
  packingListId?: string;
  entryId?: string;
  itineraryId?: string;
  userId?: string;
  postId?: string;
  templateId?: string;
  tipId?: string;
  viewOnly?: string | boolean;
  type?: string;
  [key: string]: string | boolean | undefined;
}

import { ENV_CONFIG } from '../config/environment';

export const APP_CONFIG = {
  androidPackage: ENV_CONFIG.ANDROID_PACKAGE,
  iosBundleId: ENV_CONFIG.IOS_BUNDLE_ID,
  urlScheme: ENV_CONFIG.URL_SCHEME,
  androidStoreUrl: ENV_CONFIG.ANDROID_STORE_URL,
  iosStoreUrl: ENV_CONFIG.IOS_STORE_URL,
  backendUrl: ENV_CONFIG.BACKEND_URL,
};

export function buildDeeplinkUrl(path: string, params?: DeeplinkParams): string {
  const url = new URL(APP_CONFIG.urlScheme + path);
  console.log('buildDeeplinkUrl: Base URL:', APP_CONFIG.urlScheme + path);
  
  if (params) {
    console.log('buildDeeplinkUrl: Adding params:', params);
    Object.entries(params).forEach(([key, value]: [string, string | boolean | undefined]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  const finalUrl = url.toString();
  console.log('buildDeeplinkUrl: Final URL:', finalUrl);
  return finalUrl;
}

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

export function getStoreUrl(): string {
  const platform = detectPlatform();
  return platform === 'ios' ? APP_CONFIG.iosStoreUrl : APP_CONFIG.androidStoreUrl;
}

export function attemptAppOpen(deeplinkUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('attemptAppOpen: Starting with URL:', deeplinkUrl);
    
    if (typeof window === 'undefined') {
      console.log('attemptAppOpen: No window object, resolving false');
      resolve(false);
      return;
    }

    const platform = detectPlatform();
    console.log('attemptAppOpen: Platform detected:', platform);
    
    // For desktop, we can't detect if the app opens, so we'll assume it doesn't
    if (platform === 'desktop') {
      resolve(false);
      return;
    }

    // Simple approach: just redirect to the deeplink URL
    // The browser will handle opening the app or showing an error
    window.location.href = deeplinkUrl;
    
    // Assume it worked (the page will either open the app or stay on the page)
    resolve(true);
  });
}

export function parseUrlPath(pathname: string): { type: string; id: string; params: DeeplinkParams } | null {
  const path = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const segments = path.split('/');
  
  if (segments.length === 0) return null;
  
  const type = segments[0];
  const id = segments[1];
  
  if (!id) return null;
  
  const params: DeeplinkParams = { [type === 'trip' ? 'tripId' : 'id']: id };
  
  // Handle specific parameter mappings
  switch (type) {
    case 'trip':
      params.tripId = id;
      break;
    case 'packing':
      params.tripId = id;
      break;
    case 'journal':
      params.tripId = id;
      break;
    case 'itinerary':
      params.tripId = id;
      break;
    case 'profile':
      params.userId = id;
      break;
    case 'discover':
      if (segments[1] === 'post' && segments[2]) {
        params.postId = segments[2];
      }
      break;
    case 'template':
      params.templateId = id;
      break;
    case 'tip':
      params.tipId = id;
      break;
    case 'create':
      // No ID needed for create
      break;
  }
  
  return { type, id, params };
}

export function buildAppPath(type: string, id: string, params: DeeplinkParams): string {
  switch (type) {
    case 'trip':
      return `trip/${id}`;
    case 'packing':
      return `packing/${id}`;
    case 'journal':
      return `journal/${id}`;
    case 'itinerary':
      return `itinerary/${id}`;
    case 'profile':
      return `profile/${id}`;
    case 'discover':
      return `discover/post/${id}`;
    case 'template':
      return `template/${id}`;
    case 'tip':
      return `tip/${id}`;
    case 'create':
      return 'create';
    default:
      return '';
  }
}

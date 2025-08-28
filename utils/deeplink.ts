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
  
  if (params) {
    Object.entries(params).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
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
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const platform = detectPlatform();
    
    // For desktop, we can't detect if the app opens, so we'll assume it doesn't
    if (platform === 'desktop') {
      resolve(false);
      return;
    }

    // Create a hidden iframe to attempt opening the app
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deeplinkUrl;
    
    let hasOpened = false;
    
    // Set a timeout to detect if the app opened
    const timeout = setTimeout(() => {
      if (!hasOpened) {
        document.body.removeChild(iframe);
        resolve(false);
      }
    }, 2000);
    
    // Listen for page visibility change (indicates app opened)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hasOpened = true;
        clearTimeout(timeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        resolve(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add iframe to page to trigger the deeplink
    document.body.appendChild(iframe);
    
    // Remove iframe after a short delay
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 100);
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

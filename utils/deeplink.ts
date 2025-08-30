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

export function attemptAppOpen(deeplinkUrl: string, timeoutMs: number = 2000): Promise<boolean> {
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

    // Store the current page visibility state
    let pageHidden = false;
    let appOpened = false;

    // Listen for page visibility changes (app opening will hide the page)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pageHidden = true;
        console.log('attemptAppOpen: Page hidden, app likely opened');
      }
    };

    // Listen for page focus/blur events
    const handlePageBlur = () => {
      pageHidden = true;
      console.log('attemptAppOpen: Page blurred, app likely opened');
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handlePageBlur);

    // Set a timeout to detect if the app opened
    const timeout = setTimeout(() => {
      console.log('attemptAppOpen: Timeout reached, app likely not installed');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handlePageBlur);
      resolve(false);
    }, timeoutMs);

    // Try to open the app
    try {
      console.log('attemptAppOpen: Attempting to open app with URL:', deeplinkUrl);
      window.location.href = deeplinkUrl;
      
      // Check if page was hidden (indicating app opened)
      setTimeout(() => {
        if (pageHidden) {
          clearTimeout(timeout);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('blur', handlePageBlur);
          console.log('attemptAppOpen: App opened successfully (page hidden)');
          resolve(true);
        } else {
          // If page wasn't hidden, the app probably didn't open
          clearTimeout(timeout);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('blur', handlePageBlur);
          console.log('attemptAppOpen: App did not open (page still visible)');
          resolve(false);
        }
      }, 500); // Wait 500ms to see if page gets hidden
      
    } catch (error) {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handlePageBlur);
      console.error('attemptAppOpen: Error opening app:', error);
      resolve(false);
    }
  });
}

export function parseUrlPath(pathname: string): { type: string; id: string; params: DeeplinkParams } | null {
  const path = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const segments = path.split('/').filter(Boolean);
  
  console.log('parseUrlPath: Parsing path:', pathname, 'segments:', segments);
  
  if (segments.length === 0) return null;
  
  const type = segments[0];
  let id = '';
  const params: DeeplinkParams = {};
  
  // Handle different URL patterns
  switch (type) {
    case 'trip':
      if (segments[1]) {
        id = segments[1];
        params.tripId = id;
      }
      break;
      
    case 'packing':
      if (segments[1]) {
        id = segments[1];
        params.packingListId = id;
      }
      break;
      
    case 'journal':
      if (segments[1]) {
        id = segments[1];
        params.entryId = id;
      }
      break;
      
    case 'itinerary':
      if (segments[1]) {
        id = segments[1];
        params.itineraryId = id;
      }
      break;
      
    case 'profile':
      if (segments[1]) {
        id = segments[1];
        params.userId = id;
      }
      break;
      
    case 'discover':
      if (segments[1] === 'post' && segments[2]) {
        id = segments[2];
        params.postId = id;
      }
      break;
      
    case 'template':
      if (segments[1]) {
        id = segments[1];
        params.templateId = id;
      }
      break;
      
    case 'tip':
      if (segments[1]) {
        id = segments[1];
        params.tipId = id;
      }
      break;
      
    case 'create':
      // No ID needed for create
      id = 'create';
      break;
      
    default:
      return null;
  }
  
  if (!id && type !== 'create') {
    return null;
  }
  
  console.log('parseUrlPath: Parsed result:', { type, id, params });
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

export function getPageTitle(type: string, id: string): string {
  switch (type) {
    case 'trip':
      return 'Trip Details';
    case 'packing':
      return 'Packing List';
    case 'journal':
      return 'Travel Journal';
    case 'itinerary':
      return 'Trip Itinerary';
    case 'profile':
      return 'User Profile';
    case 'discover':
      return 'Discovery Post';
    case 'template':
      return 'Trip Template';
    case 'tip':
      return 'Travel Tip';
    case 'create':
      return 'Create Trip';
    default:
      return 'TripWiser';
  }
}

export function getPageDescription(type: string, id: string): string {
  switch (type) {
    case 'trip':
      return 'View trip details and plan your adventure';
    case 'packing':
      return 'Check your packing list and travel essentials';
    case 'journal':
      return 'Read travel memories and experiences';
    case 'itinerary':
      return 'Explore your trip itinerary and schedule';
    case 'profile':
      return 'View user profile and travel history';
    case 'discover':
      return 'Discover amazing travel content';
    case 'template':
      return 'Use this trip template for your next adventure';
    case 'tip':
      return 'Learn valuable travel tips and advice';
    case 'create':
      return 'Start planning your next trip';
    default:
      return 'Your personal travel companion';
  }
}

# Self-Hosted Attribution Integration Guide - Website

## Overview

This guide covers integrating the self-hosted attribution system into the TripWiser redirecting website. The website captures device fingerprints when users click affiliate/referral links and sends them to the backend for attribution tracking before redirecting to app stores.

## Prerequisites

- Backend attribution system is deployed and running
- Attribution API endpoints are accessible
- Website is using Next.js with TypeScript
- Environment variables configured

---

## Implementation Steps

### Step 1: Update Environment Variables

Add the backend API URL to your environment configuration.

**File: `.env.local`**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

**File: `.env.production`**
```env
NEXT_PUBLIC_API_URL=https://your-production-backend.com/api
```

---

### Step 2: Create Device Fingerprint Utility

Create a utility to generate device fingerprints in the browser.

**File: `src/utils/deviceFingerprint.ts`**
```typescript
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
  const language = navigator.language || navigator.languages?.[0] || 'en-US';

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
    return 'https://apps.apple.com/app/tripwiser/YOUR_APP_ID';
  } else if (platform === 'Android') {
    return 'https://play.google.com/store/apps/details?id=com.tripwiser.app';
  }
  // Fallback to a landing page or generic store link
  return 'https://tripwiser.com/download';
}
```

---

### Step 3: Create Attribution API Client

Create an API client to communicate with the backend attribution endpoints.

**File: `src/services/attributionApi.ts`**
```typescript
import { DeviceFingerprint } from '../utils/deviceFingerprint';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface TrackClickData {
  fingerprint: DeviceFingerprint;
  affiliateType: 'elite_gift' | 'influencer_referral';
  influencerId?: string;
  linkId?: string;
}

export interface TrackClickResponse {
  success: boolean;
  message: string;
  data?: {
    clickId: string;
    fingerprint: string;
    expiresAt: Date;
  };
}

/**
 * Tracks a click on an affiliate/referral link
 */
export async function trackAttributionClick(
  data: TrackClickData
): Promise<TrackClickResponse> {
  try {
    const response = await fetch(`${API_URL}/attribution/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fingerprintData: data.fingerprint,
        affiliateType: data.affiliateType,
        influencerId: data.influencerId,
        linkId: data.linkId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error tracking attribution click:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to track click',
    };
  }
}
```

---

### Step 4: Create Link Redirect Page

Update your link redirect page to capture fingerprints before redirecting.

**File: `src/pages/link/[linkId].tsx`** (or `src/app/link/[linkId]/page.tsx` for App Router)

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  generateDeviceFingerprint,
  isMobileDevice,
  getStoreURL,
} from '../../utils/deviceFingerprint';
import { trackAttributionClick } from '../../services/attributionApi';

interface LinkPageProps {
  // These would come from your database
  linkData?: {
    linkId: string;
    affiliateType: 'elite_gift' | 'influencer_referral';
    influencerId?: string;
    isActive: boolean;
  };
}

export default function LinkPage({ linkData }: LinkPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');

  useEffect(() => {
    if (!linkData) {
      setStatus('error');
      return;
    }

    if (!linkData.isActive) {
      setStatus('error');
      return;
    }

    const handleRedirect = async () => {
      try {
        // Generate device fingerprint
        const fingerprint = generateDeviceFingerprint();

        // Track the click
        const trackingResult = await trackAttributionClick({
          fingerprint,
          affiliateType: linkData.affiliateType,
          influencerId: linkData.influencerId,
          linkId: linkData.linkId,
        });

        console.log('Attribution click tracked:', trackingResult);

        // Determine redirect URL
        let redirectUrl: string;

        if (isMobileDevice()) {
          // Redirect to appropriate app store
          redirectUrl = getStoreURL(fingerprint.platform);
        } else {
          // Redirect to download page or main website
          redirectUrl = 'https://tripwiser.com/download';
        }

        setStatus('redirecting');

        // Redirect after a short delay to ensure tracking completes
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } catch (error) {
        console.error('Error handling link redirect:', error);
        setStatus('error');
      }
    };

    handleRedirect();
  }, [linkData]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Preparing your TripWiser experience...</p>
        </div>
      </div>
    );
  }

  if (status === 'redirecting') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Redirecting you to TripWiser...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-pink-600">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl font-bold mb-4">Oops! Invalid or Expired Link</h1>
          <p className="text-lg mb-6">
            This link is no longer valid or has expired.
          </p>
          <a
            href="https://tripwiser.com"
            className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Go to TripWiser Home
          </a>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Server-side props to fetch link data
 * This runs on the server for each request
 */
export async function getServerSideProps(context: any) {
  const { linkId } = context.params;

  try {
    // Fetch link data from your backend
    const response = await fetch(`${process.env.API_URL}/affiliate/link/${linkId}`);

    if (!response.ok) {
      return {
        props: {
          linkData: null,
        },
      };
    }

    const linkData = await response.json();

    return {
      props: {
        linkData: linkData.data,
      },
    };
  } catch (error) {
    console.error('Error fetching link data:', error);
    return {
      props: {
        linkData: null,
      },
    };
  }
}
```

---

### Step 5: Create Elite Gift Link Page (Alternative)

If you have separate pages for elite gift links:

**File: `src/pages/gift/[giftId].tsx`**

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  generateDeviceFingerprint,
  isMobileDevice,
  getStoreURL,
} from '../../utils/deviceFingerprint';
import { trackAttributionClick } from '../../services/attributionApi';

interface GiftPageProps {
  giftData?: {
    linkId: string;
    isActive: boolean;
    expiresAt?: string;
  };
}

export default function GiftPage({ giftData }: GiftPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');

  useEffect(() => {
    if (!giftData) {
      setStatus('error');
      return;
    }

    if (!giftData.isActive) {
      setStatus('error');
      return;
    }

    // Check if gift has expired
    if (giftData.expiresAt && new Date(giftData.expiresAt) < new Date()) {
      setStatus('error');
      return;
    }

    const handleRedirect = async () => {
      try {
        const fingerprint = generateDeviceFingerprint();

        await trackAttributionClick({
          fingerprint,
          affiliateType: 'elite_gift',
          linkId: giftData.linkId,
        });

        let redirectUrl: string;
        if (isMobileDevice()) {
          redirectUrl = getStoreURL(fingerprint.platform);
        } else {
          redirectUrl = 'https://tripwiser.com/download';
        }

        setStatus('redirecting');

        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } catch (error) {
        console.error('Error handling gift redirect:', error);
        setStatus('error');
      }
    };

    handleRedirect();
  }, [giftData]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎁</div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-2xl font-bold">You've received an Elite Gift!</p>
          <p className="text-lg mt-2">Preparing your exclusive offer...</p>
        </div>
      </div>
    );
  }

  if (status === 'redirecting') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎁</div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-2xl font-bold">Redirecting to claim your gift...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-500 to-gray-700">
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4">Gift Unavailable</h1>
          <p className="text-lg mb-6">
            This gift link is invalid, expired, or has already been used.
          </p>
          <a
            href="https://tripwiser.com"
            className="inline-block bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Go to TripWiser Home
          </a>
        </div>
      </div>
    );
  }

  return null;
}

export async function getServerSideProps(context: any) {
  const { giftId } = context.params;

  try {
    const response = await fetch(`${process.env.API_URL}/affiliate/gift/${giftId}`);

    if (!response.ok) {
      return { props: { giftData: null } };
    }

    const giftData = await response.json();
    return { props: { giftData: giftData.data } };
  } catch (error) {
    console.error('Error fetching gift data:', error);
    return { props: { giftData: null } };
  }
}
```

---

### Step 6: Add Backend Route to Fetch Link Data

Ensure your backend has endpoints to retrieve link information.

**File: `TRIPWISER_BACKEND/routes/affiliateRoutes.js`** (add these routes if not present)

```javascript
// Get link data by linkId (public endpoint for website)
router.get('/link/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await AffiliateLink.findOne({
      _id: linkId,
      isActive: true,
    }).select('affiliateType influencerId isActive expiresAt');

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found or inactive',
      });
    }

    // Check if link has expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Link has expired',
      });
    }

    res.json({
      success: true,
      data: {
        linkId: link._id,
        affiliateType: link.affiliateType,
        influencerId: link.influencerId,
        isActive: link.isActive,
        expiresAt: link.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// Get gift link data (public endpoint for website)
router.get('/gift/:giftId', async (req, res) => {
  try {
    const { giftId } = req.params;

    const gift = await AffiliateLink.findOne({
      _id: giftId,
      affiliateType: 'elite_gift',
      isActive: true,
    }).select('isActive expiresAt usageCount maxUsages');

    if (!gift) {
      return res.status(404).json({
        success: false,
        message: 'Gift not found or inactive',
      });
    }

    // Check if gift has expired
    if (gift.expiresAt && new Date(gift.expiresAt) < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Gift has expired',
      });
    }

    // Check if gift has reached max usages
    if (gift.maxUsages && gift.usageCount >= gift.maxUsages) {
      return res.status(410).json({
        success: false,
        message: 'Gift has been fully claimed',
      });
    }

    res.json({
      success: true,
      data: {
        linkId: gift._id,
        isActive: gift.isActive,
        expiresAt: gift.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error fetching gift:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});
```

---

### Step 7: Configure CORS for Website Domain

Ensure your backend allows requests from your website domain.

**File: `TRIPWISER_BACKEND/server.js`**

```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: [
    'https://tripwiser.com',
    'https://www.tripwiser.com',
    'https://link.tripwiser.com', // If you have a separate subdomain
    'http://localhost:3000', // For local development
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

---

### Step 8: Update Package.json Dependencies

Ensure you have all necessary dependencies.

**File: `package.json`**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

---

### Step 9: Testing the Attribution Flow

#### Test Elite Gift Link

1. **Create a test gift link** in your dashboard
2. **Open the gift link** on a mobile device: `https://tripwiser.com/gift/[giftId]`
3. **Verify tracking**:
   - Check browser console for tracking success
   - Verify click is stored in backend database
4. **Follow redirect** to app store
5. **Install the app** (or open if already installed)
6. **Create an account**
7. **Verify attribution match**:
   - Check database for matched click
   - Verify user has Elite plan for 1 year
   - Check dashboard analytics for successful attribution

#### Test Influencer Referral Link

1. **Create a test referral link** for an influencer
2. **Open the link** on a mobile device: `https://tripwiser.com/link/[linkId]`
3. **Verify tracking** (same as above)
4. **Install and register**
5. **Verify**:
   - Referrer's referral count increased
   - Attribution matched correctly
   - Dashboard shows referral conversion

#### Test Desktop Browser

1. **Open link on desktop browser**
2. **Verify**: Should redirect to download/landing page
3. **Check tracking**: Click should still be recorded

#### Test Error Cases

1. **Expired link**: Should show error message
2. **Invalid link ID**: Should show error message
3. **Inactive link**: Should show error message
4. **Network failure**: Should gracefully handle and still attempt redirect

---

### Step 10: Monitoring and Analytics

#### Add Analytics Tracking (Optional)

You can add Google Analytics or custom analytics to track link performance:

**File: `src/pages/link/[linkId].tsx`**

```typescript
// Add after successful tracking
if (trackingResult.success) {
  // Google Analytics event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'attribution_click', {
      event_category: 'Attribution',
      event_label: linkData.affiliateType,
      affiliate_type: linkData.affiliateType,
      link_id: linkData.linkId,
    });
  }
}
```

#### Server Logs

Monitor your server logs for attribution tracking:

```bash
# Check recent attribution clicks
tail -f /var/log/tripwiser/attribution.log

# Monitor click patterns
grep "attribution/click" /var/log/tripwiser/access.log | tail -20
```

---

### Step 11: Deployment

#### Environment Variables

Set production environment variables:

```bash
# On your hosting platform (Vercel, Netlify, etc.)
NEXT_PUBLIC_API_URL=https://api.tripwiser.com/api
API_URL=https://api.tripwiser.com/api # For server-side
```

#### Build and Deploy

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy (example for Vercel)
vercel --prod
```

#### DNS Configuration

If using a subdomain for links:

```
# DNS Records
link.tripwiser.com  →  CNAME  →  your-hosting-provider
```

---

### Step 12: Performance Optimization

#### Preload API Calls

For faster redirect:

**File: `src/pages/_document.tsx`**

```typescript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_API_URL}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

#### Add Timeout for Tracking

Ensure redirects happen even if tracking fails:

```typescript
const handleRedirect = async () => {
  const redirectUrl = isMobileDevice()
    ? getStoreURL(fingerprint.platform)
    : 'https://tripwiser.com/download';

  // Set a timeout to redirect even if tracking fails
  const redirectTimeout = setTimeout(() => {
    window.location.href = redirectUrl;
  }, 2000); // 2 second max wait

  try {
    await trackAttributionClick({...});
    clearTimeout(redirectTimeout);

    // Immediate redirect on success
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 300);
  } catch (error) {
    // Redirect will happen via timeout
    console.error('Tracking failed, redirecting anyway:', error);
  }
};
```

---

## URL Structure

Your final URL structure should be:

```
Elite Gift Links:
https://tripwiser.com/gift/[giftId]
https://link.tripwiser.com/gift/[giftId]

Influencer Referral Links:
https://tripwiser.com/link/[linkId]
https://link.tripwiser.com/link/[linkId]
```

---

## Attribution Flow Summary

1. **User clicks link** → Website loads link page
2. **Fingerprint generated** → Device info captured
3. **Click tracked** → Sent to backend, stored in MongoDB
4. **User redirected** → App Store or download page
5. **App installed** → User opens app for first time
6. **App generates fingerprint** → Matches browser fingerprint
7. **Attribution matched** → Backend finds click within 48h window
8. **User registers** → Attribution confirmed
9. **Benefits applied** → Elite gift or referral credited

---

## Troubleshooting

### Issue: Tracking not working

**Check:**
- CORS configuration allows your website domain
- API URL environment variable is correct
- Network tab shows successful POST to `/api/attribution/click`
- Backend attribution service is running

### Issue: Redirects not working

**Check:**
- Store URLs are correct in `getStoreURL()`
- User agent detection is working
- No JavaScript errors in console

### Issue: Low match rates

**Possible causes:**
- Users clearing browser data before installing
- VPN usage changing IP addresses
- Screen resolution changing between click and install
- Time gap > 48 hours

**Solutions:**
- Extend match window to 72 hours
- Reduce fingerprint strictness (fewer required matches)
- Add manual attribution option

---

## Next Steps

1. ✅ **Deploy the website** with attribution tracking
2. **Test the full flow** from click to conversion
3. **Monitor match rates** in the dashboard
4. **Optimize fingerprint matching** if rates are low
5. **Add custom analytics** for deeper insights

---

## Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse of tracking endpoint
2. **Link Validation**: Always validate link IDs server-side
3. **Expiration**: Enforce link expiration dates
4. **HTTPS Only**: Always use HTTPS in production
5. **Input Sanitization**: Sanitize all user inputs
6. **No PII Storage**: Don't store personally identifiable information in fingerprints

---

## Support

For questions or issues with the attribution system:

1. Check attribution logs in backend
2. Review match rates in dashboard analytics
3. Test with different devices and browsers
4. Verify fingerprint generation matches between website and app

---

**Integration Complete!** 🎉

Your website now tracks attribution clicks and enables deferred deep linking for the TripWiser ecosystem.

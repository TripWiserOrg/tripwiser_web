# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TripWiser Deep Link Website - a Next.js application that bridges web links and the TripWiser mobile app through deep linking. Handles app redirection, universal links, and affiliate/influencer registration flows.

**Live URL**: https://tripwiser-web-lmgo.vercel.app/

## Development Commands

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
node scripts/test-urls.js              # Test general URL patterns
node scripts/test-affiliate-urls.js    # Test affiliate link parsing
node scripts/test-affiliate-logic.js   # Test affiliate logic
node scripts/test-specific-urls.js     # Test specific URL scenarios
```

## Architecture

### Pages Router Structure (Next.js Pages Router)

- **`pages/[...slug].tsx`** - Catch-all route that handles ALL dynamic deep link paths (e.g., `/trip/123`, `/packing/456`, `/journal/789`). Automatically redirects mobile users to `tripwiser://` scheme and shows download page for desktop users.

- **`pages/register.tsx`** - Specialized landing page for affiliate links. Parses `?affiliate=elite&linkId=X` or `?affiliate=influencer&id=Y` query parameters and generates appropriate deep links with affiliate tracking.

- **`pages/index.tsx`** - Home page with general app information and download buttons.

- **`pages/test.tsx`** - Testing page for deep link functionality.

- **`pages/_app.tsx`** - App wrapper with global meta tags for Open Graph, Twitter cards, and app store meta tags.

### Key Components

- **`components/LandingPage.tsx`** - Reusable landing page component with auto-redirect logic (3-second timeout), platform detection, and app store fallbacks.

### Utilities

- **`utils/affiliate.ts`** - Complete affiliate link handling:
  - `parseAffiliateUrl()` - Extracts affiliate type and IDs from URLs
  - `generateAppDeepLink()` - Creates `tripwiser://register?affiliateType=X&linkId=Y` deep links
  - `validateAffiliateData()` - Validates affiliate parameters
  - `detectPlatform()` - Returns 'ios', 'android', or 'desktop'
  - `openAppWithFallback()` - Attempts app opening with store fallback (iOS: 1.5s timeout, Android: 2.5s timeout)
  - `trackAffiliateClick()` - Analytics tracking for affiliate clicks

## Deep Linking Flow

### URL Scheme: `tripwiser://`

The app uses a custom URL scheme for deep linking. All web URLs are converted to app deep links:

**Web URL Pattern → Deep Link Pattern**
```
/trip/123                    → tripwiser://trip/123
/packing/456?viewOnly=true   → tripwiser://packing/456?viewOnly=true
/register?affiliate=elite    → tripwiser://register?affiliateType=elite
```

### Supported Routes

All routes handled by `[...slug].tsx`:
- `/trip/[id]` - Trip details (supports `?viewOnly=true`, `?type=upcoming/ongoing/past`)
- `/packing/[id]` - Packing lists (supports `?packingListId=X`)
- `/journal/[id]` - Journal entries (supports `?entryId=X`)
- `/itinerary/[id]` - Itineraries (supports `?itineraryId=X`)
- `/profile/[id]` - User profiles
- `/discover/post/[id]` - Discovery posts
- `/template/[id]` - Templates
- `/tip/[id]` - Tips
- `/create` - Create trip page

### Affiliate Link Handling

Handled by `pages/register.tsx`:

1. **Elite Gift Links**: Grant 1 year Elite plan FREE
   - Format: `?affiliate=elite&linkId={linkId}`
   - Deep link: `tripwiser://register?affiliateType=elite&linkId={linkId}`
   - Shows purple gradient banner with gift messaging

2. **Influencer Links**: Track referrals from content creators
   - Format: `?affiliate=influencer&id={influencerId}`
   - Deep link: `tripwiser://register?affiliateType=influencer&influencerId={influencerId}`
   - Shows blue/teal gradient banner with welcome messaging

3. **Regular Registration**: No parameters
   - Deep link: `tripwiser://register`

### Auto-Redirect Behavior

- **Mobile (iOS/Android)**: Automatically attempts to open app on page load
- **Desktop**: Shows landing page with download buttons, no auto-redirect
- **Fallback Detection**: Uses `visibilitychange` event to detect if app opened (page becomes hidden)
  - **iOS**: Uses hidden iframe technique with 2.5s timeout, then redirects to App Store
  - **Android**: Direct redirect with 2.5s timeout, then redirects to Play Store
- **Manual Override**: All pages include "Click here to open manually" button with same fallback logic

## Universal Links Configuration

### iOS - Apple App Site Association
**File**: `public/.well-known/apple-app-site-association`
- Configured in `next.config.js` with proper `application/json` content-type header
- Required for iOS Universal Links support

### Android - App Links
**File**: `public/.well-known/assetlinks.json`
- Configured in `next.config.js` with proper `application/json` content-type header
- Required for Android App Links support

Both files served via Vercel configuration in `vercel.json`.

## App Store URLs

- **iOS**: https://apps.apple.com/us/app/tripwiser-social-travel/id6751107025
- **Android**: https://play.google.com/store/apps/details?id=com.tripwiser.android.app

## Important Technical Details

### Path Alias
- `@/*` maps to root directory (configured in `tsconfig.json`)
- Example: `import { parseAffiliateUrl } from '@/utils/affiliate'`

### Environment & Platform Detection
- All platform detection must happen client-side (use `useEffect` or check `typeof window !== 'undefined'`)
- Server-side rendering requires hydration-safe code - set `isClient` state in `useEffect`

### Query Parameter Handling
- Use `router.query` from Next.js router, but filter out Next.js internal params like `slug`
- Preserve all user-provided query parameters when building deep links

### Styling
- Uses Tailwind CSS via `styles/globals.css`
- Global styles include fade-in animations for landing pages
- Responsive design with mobile-first approach

### Vercel Deployment
- `vercel.json` handles URL rewrites and headers for `.well-known` files
- All routes fallback to index except `.well-known` endpoints

## Common Tasks

### Adding a New Deep Link Route
1. The route is already handled by `[...slug].tsx` catch-all
2. No code changes needed - just test the URL pattern
3. Ensure mobile app has corresponding route handler

### Modifying Affiliate Link Logic
1. Update parsing in `utils/affiliate.ts`
2. Modify deep link generation in `generateAppDeepLink()`
3. Update UI in `pages/register.tsx` for new affiliate types
4. Test with `node scripts/test-affiliate-urls.js`

### Debugging Deep Links
1. Check browser console for logged deep link URLs
2. Test on actual mobile device (simulators may behave differently)
3. Use `/test` page for manual testing
4. Verify URL scheme is registered in mobile app's `Info.plist` (iOS) or `AndroidManifest.xml` (Android)

## Key Files Reference

- **Deep linking logic**: `pages/[...slug].tsx:10-39` (useEffect for redirect)
- **Affiliate parsing**: `utils/affiliate.ts:14-40`
- **Deep link generation**: `utils/affiliate.ts:45-67`
- **Platform detection**: `utils/affiliate.ts:102-114`
- **Auto-open with fallback**: `utils/affiliate.ts:119-163`
- **App meta tags**: `pages/_app.tsx:8-35`

## Documentation Files

- **README.md** - Comprehensive feature documentation and URL examples
- **WEBSITE_AFFILIATE_INTEGRATION.md** - Detailed affiliate link implementation guide
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **VERCEL_SETUP.md** - Vercel-specific setup guide

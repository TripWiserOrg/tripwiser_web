# TripWiser Deep Link Website

A Next.js website that handles deep linking for the TripWiser mobile app. This website serves as a bridge between web links and the TripWiser mobile application, providing seamless user experience for shared content.

## Features

### ✅ Dynamic Route Handling

The website handles all URL patterns:

- `/trip/[id]` - Trip details
- `/packing/[id]` - Packing lists
- `/journal/[id]` - Journal entries
- `/itinerary/[id]` - Itineraries
- `/profile/[id]` - User profiles
- `/discover/post/[id]` - Discovery posts
- `/template/[id]` - Templates
- `/tip/[id]` - Tips
- `/create` - Create trip

### ✅ Query Parameter Support

Handles various query parameters:

- `viewOnly=true` - Read-only mode
- `packingListId=xxx` - Specific packing list
- `entryId=xxx` - Specific journal entry
- `itineraryId=xxx` - Specific itinerary
- `type=upcoming/ongoing/past` - Trip type filter

### ✅ Smart App Opening Logic

- Attempts to open the TripWiser app using `tripwiser://` scheme
- 2-second timeout with fallback to app stores
- Platform detection (iOS/Android/Desktop)
- Loading states and user feedback

### ✅ Universal Links Support

- Apple App Site Association (`.well-known/apple-app-site-association`)
- Android App Links (`.well-known/assetlinks.json`)
- Proper content-type headers

### ✅ Error Handling

- Invalid URL redirection to home page
- Graceful fallbacks for missing app
- User-friendly error messages

## URL Examples

### Trip Details

```
https://tripwiser-web-lmgo.vercel.app/trip/123
https://tripwiser-web-lmgo.vercel.app/trip/123?viewOnly=true
```

### Packing Lists

```
https://tripwiser-web-lmgo.vercel.app/packing/456
https://tripwiser-web-lmgo.vercel.app/packing/456?packingListId=789
```

### Journal Entries

```
https://tripwiser-web-lmgo.vercel.app/journal/789
https://tripwiser-web-lmgo.vercel.app/journal/789?entryId=101
```

### Itineraries

```
https://tripwiser-web-lmgo.vercel.app/itinerary/101
https://tripwiser-web-lmgo.vercel.app/itinerary/101?itineraryId=202
```

### User Profiles

```
https://tripwiser-web-lmgo.vercel.app/profile/user123
```

### Discovery Posts

```
https://tripwiser-web-lmgo.vercel.app/discover/post/303
```

### Templates

```
https://tripwiser-web-lmgo.vercel.app/template/404
```

### Travel Tips

```
https://tripwiser-web-lmgo.vercel.app/tip/505
```

### Create Trip

```
https://tripwiser-web-lmgo.vercel.app/create
https://tripwiser-web-lmgo.vercel.app/create?type=upcoming
```

## Technical Implementation

### Deep Link Structure

The app uses the `tripwiser://` URL scheme:

```
tripwiser://[path]?[parameters]
```

### Universal Links

- **iOS**: `https://tripwiser-web-lmgo.vercel.app/.well-known/apple-app-site-association`
- **Android**: `https://tripwiser-web-lmgo.vercel.app/.well-known/assetlinks.json`

### App Store URLs

- **iOS**: `https://apps.apple.com/app/tripwiser/MT98B5253F`
- **Android**: `https://play.google.com/store/apps/details?id=com.tripwiser.android.app`

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Testing URLs

```bash
node scripts/test-urls.js
```

## Configuration

Update the configuration in `config/environment.ts`:

```typescript
export const ENV_CONFIG = {
  APP_URL: "https://tripwiser-web-lmgo.vercel.app/",
  ANDROID_STORE_URL:
    "https://play.google.com/store/apps/details?id=com.tripwiser.android.app",
  IOS_STORE_URL: "https://apps.apple.com/app/tripwiser/MT98B5253F",
  ANDROID_PACKAGE: "com.tripwiser.android.app",
  IOS_BUNDLE_ID: "com.tripwiser.app",
  URL_SCHEME: "tripwiser://",
};
```

## Deployment

The website is deployed on Vercel at:
https://tripwiser-web-lmgo.vercel.app/

### Vercel Configuration

The `vercel.json` file configures:

- URL rewrites for universal links
- Proper content-type headers
- Fallback routing

## User Experience Flow

1. **User clicks shared link** → Website loads
2. **Website detects platform** → iOS/Android/Desktop
3. **Attempts to open app** → Uses `tripwiser://` scheme
4. **If app opens** → User sees content in app
5. **If app not installed** → Shows download buttons
6. **Fallback to app stores** → User can download app

## Mobile App Integration

The mobile app should handle the following URL schemes:

### iOS (Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.tripwiser.app</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>tripwiser</string>
    </array>
  </dict>
</array>
```

### Android (AndroidManifest.xml)

```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="tripwiser-web-lmgo.vercel.app" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="tripwiser" />
  </intent-filter>
</activity>
```

## Support

For issues or questions about the deep linking implementation, please refer to the mobile app documentation or contact the development team.

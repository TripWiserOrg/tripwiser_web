# TripWiser Deeplink Website - Deployment Guide

## Quick Start

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm run dev`
3. **Test locally**: Visit `http://localhost:3000`
4. **Deploy**: Follow the deployment instructions below

## Required Information

Before deploying, gather these details:

### iOS Configuration

- **Team ID**: From Apple Developer Portal
- **Bundle ID**: `com.tripwiser.app`
- **App Store ID**: Once published (replace `1234567890`)

### Android Configuration

- **Package Name**: `com.tripwiser.android.app`
- **SHA256 Fingerprint**: From Google Play Console

### Domain Configuration

- **Custom Domain**: `tripwiser.app` (or your preferred domain)
- **SSL Certificate**: Required for universal links

## Configuration Steps

### 1. Update App Configuration

Edit `config/environment.ts`:

```typescript
export const ENV_CONFIG = {
  APP_URL: "https://tripwiser.app", // Your domain
  ANDROID_STORE_URL:
    "https://play.google.com/store/apps/details?id=com.tripwiser.android.app",
  IOS_STORE_URL: "https://apps.apple.com/app/tripwiser/YOUR_APP_STORE_ID",
  // ... other config
};
```

### 2. Update Universal Link Files

#### Apple App Site Association

Edit `public/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "YOUR_TEAM_ID.com.tripwiser.app",
        "paths": [
          "/trip/*",
          "/packing/*",
          "/journal/*",
          "/itinerary/*",
          "/profile/*",
          "/discover/post/*",
          "/template/*",
          "/tip/*",
          "/create*"
        ]
      }
    ]
  }
}
```

#### Digital Asset Links

Edit `public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.tripwiser.android.app",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
    }
  }
]
```

### 3. Add App Images

Replace placeholder files with actual images:

- `public/favicon.ico` (32x32)
- `public/apple-touch-icon.png` (180x180)
- `public/og-image.png` (1200x630)

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   npm run build
   vercel --prod
   ```

3. **Set up custom domain**:
   - Go to Vercel dashboard
   - Add your domain (e.g., `tripwiser.app`)
   - Configure DNS records

### Option 2: Netlify

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Set up custom domain**

### Option 3: Manual Deployment

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Upload files** to your hosting provider
3. **Configure Node.js** hosting
4. **Set up SSL certificate**

## Testing Checklist

### Local Testing

- [ ] `npm run dev` starts successfully
- [ ] All URL patterns load correctly
- [ ] Landing page displays properly
- [ ] Download buttons work

### Production Testing

- [ ] Website loads over HTTPS
- [ ] All URL patterns work
- [ ] Universal links work on iOS
- [ ] App links work on Android
- [ ] App store redirects work
- [ ] Social media previews work

### URL Patterns to Test

```
https://tripwiser.app/trip/123
https://tripwiser.app/trip/123?viewOnly=true
https://tripwiser.app/packing/456?packingListId=789
https://tripwiser.app/journal/101?entryId=202&viewOnly=true
https://tripwiser.app/itinerary/303?itineraryId=404
https://tripwiser.app/profile/user505
https://tripwiser.app/discover/post/606
https://tripwiser.app/template/707
https://tripwiser.app/tip/808?viewOnly=true
https://tripwiser.app/create?type=upcoming
```

## Mobile App Integration

### iOS (React Native)

Add to `app.config.js`:

```javascript
{
  ios: {
    bundleIdentifier: 'com.tripwiser.app',
    associatedDomains: ['applinks:tripwiser.app']
  }
}
```

### Android (React Native)

Add to `app.config.js`:

```javascript
{
  android: {
    package: 'com.tripwiser.android.app',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'tripwiser.app'
          }
        ],
        category: ['BROWSABLE', 'DEFAULT']
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

1. **Universal links not working**:

   - Check domain verification
   - Verify SSL certificate
   - Ensure `.well-known` files are accessible

2. **App not opening**:

   - Verify URL scheme configuration
   - Check app bundle ID/package name
   - Test on physical devices

3. **Store redirects not working**:

   - Verify app store URLs
   - Check app store IDs

4. **Meta tags not showing**:
   - Verify Open Graph tags
   - Test with social media debuggers

### Debug Mode

Enable debug logging:

```bash
NODE_ENV=development npm run dev
```

Check browser console for detailed logs.

## Security Considerations

1. **HTTPS Required**: Universal links only work over HTTPS
2. **Domain Verification**: Ensure domain ownership
3. **Input Validation**: All parameters are validated
4. **Rate Limiting**: Consider implementing for production

## Maintenance

1. **Regular Testing**: Test all URL patterns monthly
2. **App Store Updates**: Update links when app store IDs change
3. **Certificate Updates**: Update SHA256 fingerprints when certificates change
4. **Domain Renewal**: Ensure domain doesn't expire
5. **Performance Monitoring**: Monitor loading times

## Support

For issues:

1. Check troubleshooting section
2. Verify all configuration
3. Test on different devices
4. Check browser console for errors

## Success Metrics

Track these metrics:

1. **App Open Rate**: Percentage of successful app opens
2. **Install Conversion Rate**: App installs from links
3. **User Engagement**: Time spent in app after opening
4. **Share Rate**: How often users share links
5. **Error Rate**: Failed redirects

## Next Steps

After deployment:

1. Test all URL patterns thoroughly
2. Configure analytics tracking
3. Set up monitoring and alerts
4. Document the setup for your team
5. Plan regular maintenance schedule


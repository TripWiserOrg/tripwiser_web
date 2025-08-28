# TripWiser Deeplink Website

A Next.js website that handles deeplinks for the TripWiser mobile app, redirecting users to the appropriate screens when they click shared links.

## Features

- **Universal Links Support**: Works with both iOS and Android apps
- **Multiple URL Patterns**: Handles all TripWiser content types
- **Smart Fallbacks**: Redirects to app stores if app is not installed
- **SEO Optimized**: Proper meta tags for social sharing
- **Responsive Design**: Works on all devices
- **Modern UI**: Beautiful landing page with TripWiser branding

## URL Patterns Supported

- `/trip/{tripId}` - Trip details
- `/packing/{tripId}` - Packing lists
- `/journal/{tripId}` - Journal entries
- `/itinerary/{tripId}` - Trip itineraries
- `/profile/{userId}` - User profiles
- `/discover/post/{postId}` - Discovery posts
- `/template/{templateId}` - Trip templates
- `/tip/{tipId}` - Travel tips
- `/create` - Create new trip

## Prerequisites

Before deploying, you need to gather the following information:

1. **iOS Team ID**: From Apple Developer Portal
2. **Android SHA256 Fingerprint**: From Google Play Console
3. **iOS App Store ID**: Once app is published
4. **Custom Domain**: For universal links to work

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Update Configuration

Edit the following files with your actual values:

#### `utils/deeplink.ts`

- Update `iosStoreUrl` with your actual App Store ID
- Update `androidStoreUrl` if needed

#### `public/.well-known/apple-app-site-association`

- Replace `TEAM_ID` with your actual iOS Team ID

#### `public/.well-known/assetlinks.json`

- Replace `YOUR_APP_SIGNING_SHA256_FINGERPRINT` with your actual SHA256 fingerprint

### 3. Development

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up your custom domain in Vercel
4. Deploy

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Set up your custom domain

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `.next` folder to your hosting provider
3. Ensure your hosting provider supports Node.js

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_APP_URL=https://tripwiser.app
NEXT_PUBLIC_BACKEND_URL=https://tripwiser-backend.onrender.com
```

### Custom Domain Setup

1. Purchase a domain (e.g., `tripwiser.app`)
2. Configure DNS to point to your hosting provider
3. Set up SSL certificate (automatic with Vercel/Netlify)
4. Update the domain in all meta tags and configuration files

## Testing

### Test URLs

Once deployed, test these URLs:

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

### Testing Checklist

- [ ] iOS device with app installed
- [ ] iOS device without app installed
- [ ] Android device with app installed
- [ ] Android device without app installed
- [ ] Desktop browser
- [ ] All URL patterns work correctly
- [ ] App store redirects work
- [ ] Social media previews work

## App Integration

### iOS (React Native)

Add to your `app.config.js`:

```javascript
{
  ios: {
    bundleIdentifier: 'com.tripwiser.app',
    associatedDomains: ['applinks:tripwiser.app']
  }
}
```

### Android (React Native)

Add to your `app.config.js`:

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

## Security Considerations

1. **HTTPS Required**: Universal links only work over HTTPS
2. **Domain Verification**: Ensure domain ownership for app store listings
3. **Input Validation**: All URL parameters are validated
4. **Rate Limiting**: Consider implementing rate limiting for production

## Analytics

The website includes basic analytics tracking. You can enhance this by:

1. Adding Google Analytics
2. Tracking link clicks
3. Monitoring app install conversions
4. Tracking user engagement

## Maintenance

1. **Regular Testing**: Test all URL patterns monthly
2. **App Store Updates**: Update links when app store IDs change
3. **Certificate Updates**: Update SHA256 fingerprints when certificates change
4. **Domain Renewal**: Ensure domain doesn't expire
5. **Performance Monitoring**: Monitor loading times and redirect speeds

## Troubleshooting

### Common Issues

1. **Universal links not working**: Check domain verification and SSL certificate
2. **App not opening**: Verify URL scheme and app configuration
3. **Store redirects not working**: Check app store URLs
4. **Meta tags not showing**: Verify Open Graph tags

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and checking browser console for detailed logs.

## Support

For issues or questions:

1. Check the troubleshooting section
2. Verify all configuration is correct
3. Test on different devices and platforms
4. Check browser console for errors

## License

This project is proprietary to TripWiser. All rights reserved.


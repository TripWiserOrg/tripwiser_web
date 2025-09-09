# Website Affiliate Link Integration Guide

## Overview

This document explains how the TripWiser website should handle affiliate links and generate appropriate deep links to open the mobile app. The website acts as a bridge between web-based affiliate links and the mobile app registration flow.

## Affiliate Link Types

The website needs to handle two types of affiliate links that redirect to the mobile app:

### 1. Elite Gift Links

**Purpose**: Grant 1 year of Elite plan to new users  
**Format**: `https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite&linkId={linkId}`

### 2. Influencer Affiliate Links

**Purpose**: Track referrals from content creators  
**Format**: `https://tripwiser-web-lmgo.vercel.app/register?affiliate=influencer&id={influencerId}`

## Website Implementation

### URL Parsing

The website should parse incoming affiliate URLs and extract the relevant parameters:

```javascript
function parseAffiliateUrl(url) {
  const urlObj = new URL(url);
  const affiliate = urlObj.searchParams.get("affiliate");
  const linkId = urlObj.searchParams.get("linkId");
  const influencerId = urlObj.searchParams.get("id");

  if (affiliate === "elite") {
    return {
      type: "elite",
      linkId: linkId || null,
    };
  }

  if (affiliate === "influencer") {
    return {
      type: "influencer",
      influencerId: influencerId,
    };
  }

  return null;
}
```

### Deep Link Generation

Based on the parsed parameters, generate the appropriate deep link for the mobile app:

```javascript
function generateAppDeepLink(affiliateData) {
  const baseAppUrl = "tripwiser://register"; // Your app's custom URL scheme

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
    params.append("influencerId", affiliateData.influencerId);
  }

  return `${baseAppUrl}?${params.toString()}`;
}
```

## Complete Website Flow

### 1. Landing Page Handler

```javascript
// Example Express.js route handler
app.get("/register", (req, res) => {
  const affiliateData = parseAffiliateUrl(req.url);

  if (affiliateData) {
    // Show affiliate-specific landing page
    res.render("affiliate-landing", {
      affiliateType: affiliateData.type,
      linkId: affiliateData.linkId,
      influencerId: affiliateData.influencerId,
    });
  } else {
    // Show regular registration page
    res.render("register");
  }
});
```

### 2. Landing Page Template

```html
<!-- affiliate-landing.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>TripWiser - Join Now</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div class="container">
      <h1>Welcome to TripWiser!</h1>

      <!-- Elite Gift Banner -->
      {% if affiliateType === 'elite' %}
      <div class="elite-banner">
        <h2>🎉 You're getting 1 year of Elite plan FREE!</h2>
        <p>
          Unlock unlimited trip planning, advanced AI features, and premium
          support.
        </p>
      </div>
      {% endif %}

      <!-- Influencer Banner -->
      {% if affiliateType === 'influencer' %}
      <div class="influencer-banner">
        <h2>👋 Welcome! You were referred by one of our amazing creators</h2>
        <p>Start planning your next adventure with our free features.</p>
      </div>
      {% endif %}

      <div class="cta-section">
        <h3>Download the TripWiser App</h3>
        <p>Get the best travel planning experience on your mobile device.</p>

        <div class="download-buttons">
          <a href="#" id="openAppBtn" class="btn btn-primary">
            Open TripWiser App
          </a>
          <a href="#" id="downloadAppBtn" class="btn btn-secondary">
            Download App
          </a>
        </div>
      </div>
    </div>

    <script>
      // Generate deep link based on affiliate data
      const affiliateData = {
        type: "{{ affiliateType }}",
        linkId: "{{ linkId }}",
        influencerId: "{{ influencerId }}",
      };

      const deepLink = generateAppDeepLink(affiliateData);

      // Handle app opening
      document.getElementById("openAppBtn").addEventListener("click", (e) => {
        e.preventDefault();
        openApp(deepLink);
      });

      function openApp(deepLink) {
        // Try to open the app
        window.location.href = deepLink;

        // Fallback: redirect to app store after delay
        setTimeout(() => {
          window.location.href = "https://apps.apple.com/app/tripwiser"; // iOS
          // or 'https://play.google.com/store/apps/details?id=com.tripwiser' for Android
        }, 2000);
      }
    </script>
  </body>
</html>
```

### 3. Advanced App Detection

For better user experience, implement app detection:

```javascript
function openAppWithFallback(deepLink) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
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
        window.location.href = "https://apps.apple.com/app/tripwiser";
      }
    }, 1000);
  } else if (isAndroid) {
    // Android app detection
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // Fallback after delay
    setTimeout(() => {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.tripwiser";
    }, 2000);
  } else {
    // Desktop - show QR code or direct to app store
    showQRCode(deepLink);
  }
}
```

## Deep Link Formats

### Elite Gift Links

**With LinkId (New Format):**

```
tripwiser://register?affiliateType=elite&linkId=65a1b2c3d4e5f6a7b8c9d001
```

**Without LinkId (Legacy Format):**

```
tripwiser://register?affiliateType=elite
```

### Influencer Affiliate Links

```
tripwiser://register?affiliateType=influencer&influencerId=64f8a1b2c3d4e5f6a7b8c9d0
```

### Regular Registration

```
tripwiser://register
```

## URL Scheme Configuration

Make sure your mobile app is configured to handle the `tripwiser://` URL scheme:

### iOS (Info.plist)

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>tripwiser</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>tripwiser</string>
        </array>
    </dict>
</array>
```

### Android (AndroidManifest.xml)

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="tripwiser" />
    </intent-filter>
</activity>
```

## Testing Scenarios

### 1. Elite Gift Link with LinkId

**Input URL:** `https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite&linkId=65a1b2c3d4e5f6a7b8c9d001`  
**Expected Deep Link:** `tripwiser://register?affiliateType=elite&linkId=65a1b2c3d4e5f6a7b8c9d001`  
**Expected Behavior:** User sees elite gift banner, app opens with elite registration flow

### 2. Elite Gift Link without LinkId (Legacy)

**Input URL:** `https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite`  
**Expected Deep Link:** `tripwiser://register?affiliateType=elite`  
**Expected Behavior:** User sees elite gift banner, app opens with elite registration flow (no tracking)

### 3. Influencer Affiliate Link

**Input URL:** `https://tripwiser-web-lmgo.vercel.app/register?affiliate=influencer&id=64f8a1b2c3d4e5f6a7b8c9d0`  
**Expected Deep Link:** `tripwiser://register?affiliateType=influencer&influencerId=64f8a1b2c3d4e5f6a7b8c9d0`  
**Expected Behavior:** User sees influencer welcome banner, app opens with influencer registration flow

### 4. Regular Registration

**Input URL:** `https://tripwiser-web-lmgo.vercel.app/register`  
**Expected Deep Link:** `tripwiser://register`  
**Expected Behavior:** User sees regular registration page, app opens with standard registration flow

## Error Handling

### Invalid Parameters

```javascript
function validateAffiliateData(affiliateData) {
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
```

### Fallback Behavior

- If affiliate parameters are invalid, fall back to regular registration
- If app doesn't open, redirect to appropriate app store
- Log errors for debugging and monitoring

## Analytics Integration

Track affiliate link performance on the website:

```javascript
// Google Analytics example
function trackAffiliateClick(affiliateData) {
  if (affiliateData) {
    gtag("event", "affiliate_click", {
      affiliate_type: affiliateData.type,
      link_id: affiliateData.linkId,
      influencer_id: affiliateData.influencerId,
    });
  }
}
```

## Security Considerations

1. **Parameter Validation**: Always validate affiliate parameters before processing
2. **URL Encoding**: Properly encode parameters in deep links
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Logging**: Log affiliate link usage for monitoring and debugging

## Implementation Checklist

- [ ] Parse affiliate URLs correctly
- [ ] Generate appropriate deep links
- [ ] Implement app detection and fallback
- [ ] Create affiliate-specific landing pages
- [ ] Configure URL scheme in mobile app
- [ ] Test all affiliate link scenarios
- [ ] Implement analytics tracking
- [ ] Add error handling and validation
- [ ] Test on both iOS and Android devices

## Support

For questions about this integration, contact the development team or refer to the mobile app's deep linking documentation.

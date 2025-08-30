# Vercel Environment Variables Setup

## 🚨 **Issue**: Deep linking not working on Vercel deployment

The deep linking functionality works locally but not on Vercel because environment variables are not properly configured.

## 🔧 **Solution**: Set up Vercel Environment Variables

### Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project: `tripwiser-web-lmgo`
3. Click on the project to open it

### Step 2: Navigate to Environment Variables

1. Click on **"Settings"** tab
2. Click on **"Environment Variables"** in the left sidebar
3. You'll see a section to add environment variables

### Step 3: Add Required Environment Variables

Add the following environment variables one by one:

#### Required Variables:

| Variable Name                   | Value                                                                     | Description                |
| ------------------------------- | ------------------------------------------------------------------------- | -------------------------- |
| `NEXT_PUBLIC_APP_URL`           | `https://tripwiser-web-lmgo.vercel.app/`                                  | Your Vercel deployment URL |
| `NEXT_PUBLIC_BACKEND_URL`       | `https://tripwiser-backend.onrender.com`                                  | Your backend URL           |
| `NEXT_PUBLIC_ANDROID_STORE_URL` | `https://play.google.com/store/apps/details?id=com.tripwiser.android.app` | Google Play Store URL      |
| `NEXT_PUBLIC_IOS_STORE_URL`     | `https://apps.apple.com/app/tripwiser/MT98B5253F`                         | App Store URL              |
| `NEXT_PUBLIC_ANDROID_PACKAGE`   | `com.tripwiser.android.app`                                               | Android package name       |
| `NEXT_PUBLIC_IOS_BUNDLE_ID`     | `com.tripwiser.app`                                                       | iOS bundle identifier      |
| `NEXT_PUBLIC_URL_SCHEME`        | `tripwiser://`                                                            | Deep link URL scheme       |

#### Optional Variables (for analytics):

| Variable Name                   | Value          | Description                    |
| ------------------------------- | -------------- | ------------------------------ |
| `NEXT_PUBLIC_GA_TRACKING_ID`    | `G-XXXXXXXXXX` | Google Analytics ID (optional) |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | `XXXXXXXXXX`   | Facebook Pixel ID (optional)   |

### Step 4: Environment Selection

For each variable, make sure to select:

- ✅ **Production** (for live deployment)
- ✅ **Preview** (for preview deployments)
- ✅ **Development** (for local development)

### Step 5: Save and Redeploy

1. Click **"Save"** after adding each variable
2. Go to **"Deployments"** tab
3. Click **"Redeploy"** on your latest deployment
4. Wait for the deployment to complete

## 🔍 **Verification Steps**

### 1. Check Environment Variables in Vercel

After setting up, verify in Vercel dashboard:

- All variables are listed under "Environment Variables"
- All environments (Production, Preview, Development) are selected
- No variables show as "Missing"

### 2. Test the Deployment

Visit your URLs and check:

- **Browser Console**: Should show environment configuration
- **Deep Link URLs**: Should be properly generated
- **App Opening**: Should work automatically

### 3. Debug Information

The website will now log configuration in the browser console:

```javascript
// Check browser console for:
Environment Configuration: {
  APP_URL: "https://tripwiser-web-lmgo.vercel.app/",
  URL_SCHEME: "tripwiser://",
  // ... other config
}
```

## 🐛 **Troubleshooting**

### Issue: Variables not showing up

- **Solution**: Make sure to select all environments (Production, Preview, Development)
- **Solution**: Redeploy after adding variables

### Issue: Still not working after setup

- **Solution**: Clear browser cache and try again
- **Solution**: Check browser console for configuration logs
- **Solution**: Verify the deep link URL scheme matches your app

### Issue: Wrong URLs being generated

- **Solution**: Double-check the environment variable values
- **Solution**: Ensure no extra spaces in variable values

## 📱 **Testing Deep Links**

After setting up environment variables:

1. **Visit your URLs** on mobile device
2. **Check browser console** for configuration logs
3. **Click "Open App" button** to test manually
4. **Verify deep link URL** format: `tripwiser://path?params`

## 🔗 **Your URLs Should Now Work**

After setting up environment variables, these URLs should automatically open your app:

- `https://tripwiser-web-lmgo.vercel.app/packing/68accd52f86c7d41c65b9ec9?viewOnly=true&packingListId=68accd53f86c7d41c65b9ed0`
- `https://tripwiser-web-lmgo.vercel.app/discover/post/68a5a96438c9d868ba25505b`
- `https://tripwiser-web-lmgo.vercel.app/itinerary/68accd52f86c7d41c65b9ec9?viewOnly=true`
- `https://tripwiser-web-lmgo.vercel.app/journal/68accd52f86c7d41c65b9ec9?viewOnly=true`

## 📞 **Need Help?**

If you're still having issues after setting up environment variables:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the deployment completed successfully
4. Test on different devices/browsers

The environment variables are the key to making deep linking work on Vercel! 🚀

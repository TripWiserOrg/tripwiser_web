const https = require("https");

function testDebugPage() {
  return new Promise((resolve) => {
    console.log("🔍 Testing Debug Page...");
    
    https
      .get("https://tripwiser-web-lmgo.vercel.app/debug", (res) => {
        console.log(`📊 Status: ${res.statusCode}`);
        
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        
        res.on("end", () => {
          console.log("\n📄 Debug Page Analysis:");
          console.log("=======================");
          
          // Check for environment variables
          const hasEnvConfig = data.includes("Environment Configuration");
          const hasNotSet = data.includes("NOT SET");
          const hasTripwiserScheme = data.includes("tripwiser://");
          const hasAppUrl = data.includes("NEXT_PUBLIC_APP_URL");
          const hasUrlScheme = data.includes("NEXT_PUBLIC_URL_SCHEME");
          
          console.log(`✅ Has Environment Configuration section: ${hasEnvConfig}`);
          console.log(`❌ Contains "NOT SET" values: ${hasNotSet}`);
          console.log(`🔗 Contains tripwiser:// scheme: ${hasTripwiserScheme}`);
          console.log(`🌐 Contains APP_URL variable: ${hasAppUrl}`);
          console.log(`🔗 Contains URL_SCHEME variable: ${hasUrlScheme}`);
          
          // Look for specific values
          const appUrlMatch = data.match(/NEXT_PUBLIC_APP_URL.*?>(.*?)</);
          const urlSchemeMatch = data.match(/NEXT_PUBLIC_URL_SCHEME.*?>(.*?)</);
          
          if (appUrlMatch) {
            console.log(`🌐 APP_URL value: ${appUrlMatch[1]}`);
          }
          
          if (urlSchemeMatch) {
            console.log(`🔗 URL_SCHEME value: ${urlSchemeMatch[1]}`);
          }
          
          // Check if it's showing the fallback values
          const hasFallbackValues = data.includes("https://tripwiser-web-lmgo.vercel.app/") && 
                                   data.includes("tripwiser://") &&
                                   !data.includes("NOT SET");
          
          console.log(`🔄 Using fallback values: ${hasFallbackValues}`);
          
          // Check for JSON configuration
          const jsonMatch = data.match(/"URL_SCHEME":\s*"([^"]+)"/);
          if (jsonMatch) {
            console.log(`⚙️  JSON URL_SCHEME: ${jsonMatch[1]}`);
          }
          
          resolve({
            status: res.statusCode,
            hasEnvConfig,
            hasNotSet,
            hasTripwiserScheme,
            hasAppUrl,
            hasUrlScheme,
            hasFallbackValues,
            appUrl: appUrlMatch ? appUrlMatch[1] : null,
            urlScheme: urlSchemeMatch ? urlSchemeMatch[1] : null,
            jsonUrlScheme: jsonMatch ? jsonMatch[1] : null
          });
        });
      })
      .on("error", (err) => {
        console.log(`❌ Error: ${err.message}`);
        resolve({
          status: "ERROR",
          error: err.message
        });
      });
  });
}

async function runTest() {
  console.log("🔧 Debug Page Environment Test");
  console.log("==============================\n");
  
  const result = await testDebugPage();
  
  console.log("\n📊 Summary:");
  console.log("============");
  
  if (result.status === 200) {
    if (result.hasNotSet) {
      console.log("❌ Environment variables are NOT being loaded from Vercel");
      console.log("💡 This means the deployment hasn't been updated with new env vars");
    } else if (result.hasFallbackValues) {
      console.log("✅ Environment variables are working (using fallback values)");
      console.log("💡 The deep linking should work now");
    } else {
      console.log("⚠️  Mixed results - some variables working, some not");
    }
    
    console.log("\n🔧 Next Steps:");
    if (result.hasNotSet) {
      console.log("1. Make sure you redeployed after adding environment variables");
      console.log("2. Check Vercel dashboard for deployment status");
      console.log("3. Wait a few minutes for deployment to complete");
    } else {
      console.log("1. Test your deep link URLs on mobile device");
      console.log("2. Check browser console for any JavaScript errors");
      console.log("3. Try the manual 'Open App' button");
    }
  } else {
    console.log("❌ Debug page not accessible");
  }
}

runTest().catch(console.error);

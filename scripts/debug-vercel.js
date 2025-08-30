const https = require("https");

const testUrls = [
  "https://tripwiser-web-lmgo.vercel.app/packing/68accd52f86c7d41c65b9ec9?viewOnly=true&packingListId=68accd53f86c7d41c65b9ed0",
  "https://tripwiser-web-lmgo.vercel.app/discover/post/68a5a96438c9d868ba25505b",
  "https://tripwiser-web-lmgo.vercel.app/itinerary/68accd52f86c7d41c65b9ec9?viewOnly=true",
  "https://tripwiser-web-lmgo.vercel.app/journal/68accd52f86c7d41c65b9ec9?viewOnly=true",
  "https://tripwiser-web-lmgo.vercel.app/discover/post/68accd52f86c7d41c65b9ec9",
];

function testUrl(url) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testing: ${url}`);

    https
      .get(url, (res) => {
        console.log(`  📊 Status: ${res.statusCode}`);
        console.log(`  📄 Content-Type: ${res.headers["content-type"]}`);

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const hasTripWiser = data.includes("TripWiser");
          const hasAppStore =
            data.includes("App Store") || data.includes("Google Play");
          const hasOpenAppButton =
            data.includes("Open in TripWiser App") ||
            data.includes("Test Open App");
          const hasDebugUrl = data.includes("Debug URL:");
          const hasMetaRefresh = data.includes('http-equiv="refresh"');
          const hasTripwiserScheme = data.includes("tripwiser://");

          console.log(`  ✅ Contains TripWiser: ${hasTripWiser}`);
          console.log(`  📱 Contains App Store links: ${hasAppStore}`);
          console.log(`  🔘 Contains Open App button: ${hasOpenAppButton}`);
          console.log(`  🐛 Contains Debug URL: ${hasDebugUrl}`);
          console.log(`  🔄 Contains Meta Refresh: ${hasMetaRefresh}`);
          console.log(
            `  🔗 Contains tripwiser:// scheme: ${hasTripwiserScheme}`
          );

          // Look for specific debug information
          const envConfigMatch = data.match(/Environment config: ({[^}]+})/);
          const urlSchemeMatch = data.match(/URL Scheme being used: ([^"]+)/);
          const deeplinkUrlMatch = data.match(/Built deeplink URL: ([^"]+)/);

          if (envConfigMatch) {
            console.log(`  ⚙️  Environment config found: ${envConfigMatch[1]}`);
          }

          if (urlSchemeMatch) {
            console.log(`  🔗 URL Scheme: ${urlSchemeMatch[1]}`);
          }

          if (deeplinkUrlMatch) {
            console.log(`  🎯 Deep link URL: ${deeplinkUrlMatch[1]}`);
          }

          resolve({
            url,
            status: res.statusCode,
            hasTripWiser,
            hasAppStore,
            hasOpenAppButton,
            hasDebugUrl,
            hasMetaRefresh,
            hasTripwiserScheme,
            envConfig: envConfigMatch ? envConfigMatch[1] : null,
            urlScheme: urlSchemeMatch ? urlSchemeMatch[1] : null,
            deeplinkUrl: deeplinkUrlMatch ? deeplinkUrlMatch[1] : null,
          });
        });
      })
      .on("error", (err) => {
        console.log(`  ❌ Error: ${err.message}`);
        resolve({
          url,
          status: "ERROR",
          error: err.message,
        });
      });
  });
}

async function runDebugTests() {
  console.log("🔧 Vercel Deep Link Debug Test");
  console.log("==============================\n");

  const results = [];

  for (const url of testUrls) {
    const result = await testUrl(url);
    results.push(result);
  }

  console.log("\n📊 Summary:");
  console.log("============");

  const successful = results.filter((r) => r.status === 200);
  const failed = results.filter((r) => r.status !== 200);

  console.log(`✅ Successful requests: ${successful.length}/${results.length}`);
  console.log(`❌ Failed requests: ${failed.length}/${results.length}`);

  const withMetaRefresh = results.filter((r) => r.hasMetaRefresh);
  console.log(
    `🔄 Pages with Meta Refresh: ${withMetaRefresh.length}/${results.length}`
  );

  const withTripwiserScheme = results.filter((r) => r.hasTripwiserScheme);
  console.log(
    `🔗 Pages with tripwiser:// scheme: ${withTripwiserScheme.length}/${results.length}`
  );

  const withEnvConfig = results.filter((r) => r.envConfig);
  console.log(
    `⚙️  Pages with Environment config: ${withEnvConfig.length}/${results.length}`
  );

  console.log("\n🎯 Expected Deep Link URLs:");
  console.log("===========================");
  console.log(
    "tripwiser://packing/68accd52f86c7d41c65b9ec9?viewOnly=true&packingListId=68accd53f86c7d41c65b9ed0"
  );
  console.log("tripwiser://discover/post/68a5a96438c9d868ba25505b");
  console.log("tripwiser://itinerary/68accd52f86c7d41c65b9ec9?viewOnly=true");
  console.log("tripwiser://journal/68accd52f86c7d41c65b9ec9?viewOnly=true");
  console.log("tripwiser://discover/post/68accd52f86c7d41c65b9ec9");

  console.log("\n🔍 Debug Information Found:");
  console.log("===========================");
  results.forEach((result, index) => {
    if (result.envConfig || result.urlScheme || result.deeplinkUrl) {
      console.log(`\n📄 Page ${index + 1}:`);
      if (result.envConfig)
        console.log(`  ⚙️  Environment: ${result.envConfig}`);
      if (result.urlScheme) console.log(`  🔗 URL Scheme: ${result.urlScheme}`);
      if (result.deeplinkUrl)
        console.log(`  🎯 Deep Link: ${result.deeplinkUrl}`);
    }
  });

  console.log("\n💡 Troubleshooting Tips:");
  console.log("========================");
  console.log("1. Check if environment variables are set in Vercel dashboard");
  console.log("2. Verify the deployment completed successfully");
  console.log("3. Clear browser cache and try again");
  console.log("4. Check browser console for JavaScript errors");
  console.log("5. Test on different devices/browsers");
}

runDebugTests().catch(console.error);

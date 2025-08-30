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
    console.log(`Testing: ${url}`);

    https
      .get(url, (res) => {
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Content-Type: ${res.headers["content-type"]}`);

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

          console.log(`  Contains TripWiser: ${hasTripWiser}`);
          console.log(`  Contains App Store links: ${hasAppStore}`);
          console.log(`  Contains Open App button: ${hasOpenAppButton}`);
          console.log(`  Contains Debug URL: ${hasDebugUrl}`);
          console.log("  ---");

          resolve({
            url,
            status: res.statusCode,
            hasTripWiser,
            hasAppStore,
            hasOpenAppButton,
            hasDebugUrl,
          });
        });
      })
      .on("error", (err) => {
        console.log(`  Error: ${err.message}`);
        console.log("  ---");
        resolve({
          url,
          status: "ERROR",
          error: err.message,
        });
      });
  });
}

async function runTests() {
  console.log("Testing User's Specific URLs\n");
  console.log("============================\n");

  const results = [];

  for (const url of testUrls) {
    const result = await testUrl(url);
    results.push(result);
  }

  console.log("\nSummary:");
  console.log("========");

  const successful = results.filter((r) => r.status === 200);
  const failed = results.filter((r) => r.status !== 200);

  console.log(`Successful requests: ${successful.length}/${results.length}`);
  console.log(`Failed requests: ${failed.length}/${results.length}`);

  if (failed.length > 0) {
    console.log("\nFailed URLs:");
    failed.forEach((r) => {
      console.log(`  ${r.url} - ${r.status}`);
    });
  }

  const withOpenAppButton = results.filter((r) => r.hasOpenAppButton);
  console.log(
    `\nPages with Open App button: ${withOpenAppButton.length}/${results.length}`
  );

  const withDebugUrl = results.filter((r) => r.hasDebugUrl);
  console.log(`Pages with Debug URL: ${withDebugUrl.length}/${results.length}`);

  console.log("\nExpected Deep Link URLs:");
  console.log("=========================");
  console.log(
    "packing/68accd52f86c7d41c65b9ec9?viewOnly=true&packingListId=68accd53f86c7d41c65b9ed0"
  );
  console.log("discover/post/68a5a96438c9d868ba25505b");
  console.log("itinerary/68accd52f86c7d41c65b9ec9?viewOnly=true");
  console.log("journal/68accd52f86c7d41c65b9ec9?viewOnly=true");
  console.log("discover/post/68accd52f86c7d41c65b9ec9");
}

runTests().catch(console.error);

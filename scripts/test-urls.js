#!/usr/bin/env node

/**
 * Test script to verify all URL patterns work correctly
 * Run with: node scripts/test-urls.js
 */

const https = require("https");
const http = require("http");

const BASE_URL = "https://tripwiser-web-lmgo.vercel.app";

const testUrls = [
  "/",
  "/trip/123",
  "/trip/123?viewOnly=true",
  "/packing/456",
  "/packing/456?packingListId=789",
  "/journal/789",
  "/journal/789?entryId=101",
  "/itinerary/101",
  "/itinerary/101?itineraryId=202",
  "/profile/user123",
  "/discover/post/303",
  "/template/404",
  "/tip/505",
  "/create",
  "/create?type=upcoming",
  "/invalid/path",
];

function testUrl(url) {
  return new Promise((resolve) => {
    const fullUrl = BASE_URL + url;
    console.log(`Testing: ${fullUrl}`);

    https
      .get(fullUrl, (res) => {
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
          console.log(`  Contains TripWiser: ${hasTripWiser}`);
          console.log(`  Contains App Store links: ${hasAppStore}`);
          console.log("  ---");
          resolve({
            url: fullUrl,
            status: res.statusCode,
            hasTripWiser,
            hasAppStore,
          });
        });
      })
      .on("error", (err) => {
        console.log(`  Error: ${err.message}`);
        console.log("  ---");
        resolve({
          url: fullUrl,
          status: "ERROR",
          error: err.message,
        });
      });
  });
}

async function runTests() {
  console.log("Testing TripWiser Deep Link Website URLs\n");
  console.log("=====================================\n");

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

  const withTripWiser = results.filter((r) => r.hasTripWiser);
  console.log(
    `\nPages with TripWiser content: ${withTripWiser.length}/${results.length}`
  );

  const withAppStore = results.filter((r) => r.hasAppStore);
  console.log(
    `Pages with App Store links: ${withAppStore.length}/${results.length}`
  );
}

runTests().catch(console.error);

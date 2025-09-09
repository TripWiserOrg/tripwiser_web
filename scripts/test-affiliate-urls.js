#!/usr/bin/env node

/**
 * Test script to verify all affiliate URL patterns work correctly
 * Run with: node scripts/test-affiliate-urls.js
 */

const https = require("https");
const http = require("http");

const BASE_URL = "https://tripwiser-web-lmgo.vercel.app";

const testUrls = [
  // Regular registration
  "/register",

  // Elite Gift Links
  "/register?affiliate=elite",
  "/register?affiliate=elite&linkId=65a1b2c3d4e5f6a7b8c9d001",
  "/register?affiliate=elite&linkId=test123",

  // Influencer Affiliate Links
  "/register?affiliate=influencer&id=64f8a1b2c3d4e5f6a7b8c9d0",
  "/register?affiliate=influencer&id=influencer123",

  // Invalid/Edge Cases
  "/register?affiliate=invalid",
  "/register?affiliate=influencer", // Missing id
  "/register?affiliate=elite&invalidParam=test",
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
          const hasEliteBanner = data.includes("Elite plan FREE");
          const hasInfluencerBanner = data.includes("amazing creators");
          const hasAppStore =
            data.includes("App Store") || data.includes("Google Play");
          const hasDeepLink = data.includes("tripwiser://");

          console.log(`  Contains TripWiser: ${hasTripWiser}`);
          console.log(`  Contains Elite Banner: ${hasEliteBanner}`);
          console.log(`  Contains Influencer Banner: ${hasInfluencerBanner}`);
          console.log(`  Contains App Store links: ${hasAppStore}`);
          console.log(`  Contains Deep Link: ${hasDeepLink}`);
          console.log("  ---");

          resolve({
            url: fullUrl,
            status: res.statusCode,
            hasTripWiser,
            hasEliteBanner,
            hasInfluencerBanner,
            hasAppStore,
            hasDeepLink,
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

function validateDeepLinkGeneration() {
  console.log("\n🔗 Testing Deep Link Generation Logic:");
  console.log("=====================================");

  // Mock the affiliate parsing and deep link generation
  const testCases = [
    {
      url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite&linkId=65a1b2c3d4e5f6a7b8c9d001",
      expectedDeepLink:
        "tripwiser://register?affiliateType=elite&linkId=65a1b2c3d4e5f6a7b8c9d001",
      description: "Elite Gift Link with LinkId",
    },
    {
      url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite",
      expectedDeepLink: "tripwiser://register?affiliateType=elite",
      description: "Elite Gift Link without LinkId (Legacy)",
    },
    {
      url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=influencer&id=64f8a1b2c3d4e5f6a7b8c9d0",
      expectedDeepLink:
        "tripwiser://register?affiliateType=influencer&influencerId=64f8a1b2c3d4e5f6a7b8c9d0",
      description: "Influencer Affiliate Link",
    },
    {
      url: "https://tripwiser-web-lmgo.vercel.app/register",
      expectedDeepLink: "tripwiser://register",
      description: "Regular Registration",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.description}`);
    console.log(`   Input URL: ${testCase.url}`);
    console.log(`   Expected Deep Link: ${testCase.expectedDeepLink}`);

    // Parse affiliate data (simplified version)
    const urlObj = new URL(testCase.url);
    const affiliate = urlObj.searchParams.get("affiliate");
    const linkId = urlObj.searchParams.get("linkId");
    const influencerId = urlObj.searchParams.get("id");

    let affiliateData = null;
    if (affiliate === "elite") {
      affiliateData = { type: "elite", linkId: linkId || undefined };
    } else if (affiliate === "influencer") {
      affiliateData = {
        type: "influencer",
        influencerId: influencerId || undefined,
      };
    }

    // Generate deep link
    let deepLink = "tripwiser://register";
    if (affiliateData) {
      const params = new URLSearchParams();
      if (affiliateData.type === "elite") {
        params.append("affiliateType", "elite");
        if (affiliateData.linkId) {
          params.append("linkId", affiliateData.linkId);
        }
      } else if (affiliateData.type === "influencer") {
        params.append("affiliateType", "influencer");
        if (affiliateData.influencerId) {
          params.append("influencerId", affiliateData.influencerId);
        }
      }
      deepLink = `${deepLink}?${params.toString()}`;
    }

    console.log(`   Generated Deep Link: ${deepLink}`);
    console.log(
      `   ✅ Match: ${deepLink === testCase.expectedDeepLink ? "YES" : "NO"}`
    );
  });
}

async function runTests() {
  console.log("🧪 Testing TripWiser Affiliate Link Website URLs\n");
  console.log("===============================================\n");

  const results = [];

  for (const url of testUrls) {
    const result = await testUrl(url);
    results.push(result);
  }

  console.log("\n📊 Summary:");
  console.log("===========");

  const successful = results.filter((r) => r.status === 200);
  const failed = results.filter((r) => r.status !== 200);

  console.log(`Successful requests: ${successful.length}/${results.length}`);
  console.log(`Failed requests: ${failed.length}/${results.length}`);

  if (failed.length > 0) {
    console.log("\n❌ Failed URLs:");
    failed.forEach((r) => {
      console.log(`  ${r.url} - ${r.status}`);
    });
  }

  const withTripWiser = results.filter((r) => r.hasTripWiser);
  console.log(
    `\n✅ Pages with TripWiser content: ${withTripWiser.length}/${results.length}`
  );

  const withAppStore = results.filter((r) => r.hasAppStore);
  console.log(
    `✅ Pages with App Store links: ${withAppStore.length}/${results.length}`
  );

  const withDeepLink = results.filter((r) => r.hasDeepLink);
  console.log(
    `✅ Pages with Deep Link: ${withDeepLink.length}/${results.length}`
  );

  const withEliteBanner = results.filter((r) => r.hasEliteBanner);
  console.log(
    `🎉 Pages with Elite Banner: ${withEliteBanner.length}/${results.length}`
  );

  const withInfluencerBanner = results.filter((r) => r.hasInfluencerBanner);
  console.log(
    `👋 Pages with Influencer Banner: ${withInfluencerBanner.length}/${results.length}`
  );

  // Test deep link generation logic
  validateDeepLinkGeneration();

  console.log("\n🎯 Expected Results:");
  console.log("===================");
  console.log("✅ Regular registration should show standard UI");
  console.log("🎉 Elite links should show 'Elite plan FREE' banner");
  console.log("👋 Influencer links should show 'amazing creators' banner");
  console.log("🔗 All pages should contain deep link URLs");
  console.log("📱 All pages should have app store download links");
}

runTests().catch(console.error);

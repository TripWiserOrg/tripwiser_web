#!/usr/bin/env node

/**
 * Test script to verify affiliate logic locally
 * Run with: node scripts/test-affiliate-logic.js
 */

// Mock the affiliate parsing and deep link generation functions
function parseAffiliateUrl(url) {
  try {
    const urlObj = new URL(url);
    const affiliate = urlObj.searchParams.get("affiliate");
    const linkId = urlObj.searchParams.get("linkId");
    const influencerId = urlObj.searchParams.get("id");

    if (affiliate === "elite") {
      return {
        type: "elite",
        linkId: linkId || undefined,
      };
    }

    if (affiliate === "influencer") {
      return {
        type: "influencer",
        influencerId: influencerId || undefined,
      };
    }

    return null;
  } catch (error) {
    console.error("Error parsing affiliate URL:", error);
    return null;
  }
}

function generateAppDeepLink(affiliateData) {
  const baseAppUrl = "tripwiser://register";

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
    if (affiliateData.influencerId) {
      params.append("influencerId", affiliateData.influencerId);
    }
  }

  return `${baseAppUrl}?${params.toString()}`;
}

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

// Test cases
const testCases = [
  {
    url: "https://tripwiser-web-lmgo.vercel.app/register",
    expectedAffiliateData: null,
    expectedDeepLink: "tripwiser://register",
    description: "Regular Registration",
  },
  {
    url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite",
    expectedAffiliateData: { type: "elite", linkId: undefined },
    expectedDeepLink: "tripwiser://register?affiliateType=elite",
    description: "Elite Gift Link without LinkId (Legacy)",
  },
  {
    url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=elite&linkId=65a1b2c3d4e5f6a7b8c9d001",
    expectedAffiliateData: {
      type: "elite",
      linkId: "65a1b2c3d4e5f6a7b8c9d001",
    },
    expectedDeepLink:
      "tripwiser://register?affiliateType=elite&linkId=65a1b2c3d4e5f6a7b8c9d001",
    description: "Elite Gift Link with LinkId",
  },
  {
    url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=influencer&id=64f8a1b2c3d4e5f6a7b8c9d0",
    expectedAffiliateData: {
      type: "influencer",
      influencerId: "64f8a1b2c3d4e5f6a7b8c9d0",
    },
    expectedDeepLink:
      "tripwiser://register?affiliateType=influencer&influencerId=64f8a1b2c3d4e5f6a7b8c9d0",
    description: "Influencer Affiliate Link",
  },
  {
    url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=influencer",
    expectedAffiliateData: { type: "influencer", influencerId: undefined },
    expectedDeepLink: "tripwiser://register?affiliateType=influencer",
    description: "Influencer Link without ID (Invalid)",
  },
  {
    url: "https://tripwiser-web-lmgo.vercel.app/register?affiliate=invalid",
    expectedAffiliateData: null,
    expectedDeepLink: "tripwiser://register",
    description: "Invalid Affiliate Type",
  },
];

console.log("🧪 Testing Affiliate Logic Locally\n");
console.log("==================================\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   Input URL: ${testCase.url}`);

  // Parse affiliate data
  const affiliateData = parseAffiliateUrl(testCase.url);
  console.log(`   Parsed Affiliate Data: ${JSON.stringify(affiliateData)}`);

  // Validate affiliate data
  const isValid = validateAffiliateData(affiliateData);
  console.log(`   Valid: ${isValid}`);

  // Generate deep link
  const deepLink = generateAppDeepLink(affiliateData);
  console.log(`   Generated Deep Link: ${deepLink}`);
  console.log(`   Expected Deep Link: ${testCase.expectedDeepLink}`);

  // Check if affiliate data matches
  const affiliateDataMatch =
    JSON.stringify(affiliateData) ===
    JSON.stringify(testCase.expectedAffiliateData);
  console.log(`   Affiliate Data Match: ${affiliateDataMatch ? "✅" : "❌"}`);

  // Check if deep link matches
  const deepLinkMatch = deepLink === testCase.expectedDeepLink;
  console.log(`   Deep Link Match: ${deepLinkMatch ? "✅" : "❌"}`);

  if (affiliateDataMatch && deepLinkMatch) {
    passedTests++;
    console.log(`   Overall: ✅ PASS`);
  } else {
    console.log(`   Overall: ❌ FAIL`);
  }

  console.log("   ---");
});

console.log(`\n📊 Test Results:`);
console.log(`===============`);
console.log(`Passed: ${passedTests}/${totalTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log(
    `\n🎉 All tests passed! The affiliate logic is working correctly.`
  );
} else {
  console.log(`\n❌ Some tests failed. Please check the implementation.`);
}

console.log(`\n🔗 Expected Deep Link Formats:`);
console.log(`==============================`);
console.log(`Regular: tripwiser://register`);
console.log(`Elite (Legacy): tripwiser://register?affiliateType=elite`);
console.log(
  `Elite (New): tripwiser://register?affiliateType=elite&linkId={linkId}`
);
console.log(
  `Influencer: tripwiser://register?affiliateType=influencer&influencerId={influencerId}`
);

#!/usr/bin/env node

/**
 * Test script to verify all URL patterns work correctly
 * Run with: node scripts/test-urls.js
 */

const testUrls = [
  "/trip/123",
  "/trip/123?viewOnly=true",
  "/packing/456?packingListId=789",
  "/journal/101?entryId=202&viewOnly=true",
  "/itinerary/303?itineraryId=404",
  "/profile/user505",
  "/discover/post/606",
  "/template/707",
  "/tip/808?viewOnly=true",
  "/create?type=upcoming",
  "/create",
  "/",
];

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

console.log("Testing TripWiser deeplink URLs...\n");

testUrls.forEach((url, index) => {
  const fullUrl = `${baseUrl}${url}`;
  console.log(`${index + 1}. ${fullUrl}`);
});

console.log("\nTo test these URLs:");
console.log("1. Start the development server: npm run dev");
console.log("2. Open each URL in your browser");
console.log("3. Verify the landing page loads correctly");
console.log("4. Test on mobile devices with/without the app installed");

console.log("\nExpected behavior:");
console.log("- Desktop: Shows landing page with download buttons");
console.log(
  "- Mobile with app: Attempts to open app, shows landing page if fails"
);
console.log("- Mobile without app: Shows landing page, redirects to app store");


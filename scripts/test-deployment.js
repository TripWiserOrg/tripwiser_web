const https = require('https');
const http = require('http');

const BASE_URL = 'https://tripwiser-web-lmgo.vercel.app';

// Test URLs to check
const testUrls = [
  '/',
  '/test',
  '/debug',
  '/trip/123',
  '/packing/456',
  '/journal/789',
  '/.well-known/apple-app-site-association',
  '/.well-known/assetlinks.json'
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${url}`;
    const client = fullUrl.startsWith('https:') ? https : http;
    
    const req = client.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url: fullUrl,
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500) // First 500 chars
        });
      });
    });
    
    req.on('error', (error) => {
      reject({
        url: fullUrl,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({
        url: fullUrl,
        error: 'Request timeout'
      });
    });
  });
}

async function testDeployment() {
  console.log('🚀 Testing TripWiser Deployment...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const results = [];
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const result = await makeRequest(url);
      results.push(result);
      
      if (result.statusCode === 200) {
        console.log(`✅ ${url} - Status: ${result.statusCode}`);
      } else {
        console.log(`⚠️  ${url} - Status: ${result.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.error}`);
      results.push(error);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.statusCode === 200).length;
  const failed = results.length - successful;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed URLs:');
    results.forEach(result => {
      if (result.error || result.statusCode !== 200) {
        console.log(`  - ${result.url}: ${result.error || `Status ${result.statusCode}`}`);
      }
    });
  }
  
  // Check for specific issues
  console.log('\n🔍 Specific Checks:');
  
  const homePage = results.find(r => r.url === `${BASE_URL}/`);
  if (homePage && homePage.statusCode === 200) {
    const hasTripWiser = homePage.data.includes('TripWiser');
    console.log(`  Homepage loads: ${homePage.statusCode === 200 ? '✅' : '❌'}`);
    console.log(`  Contains TripWiser content: ${hasTripWiser ? '✅' : '❌'}`);
  }
  
  const appleAssociation = results.find(r => r.url.includes('apple-app-site-association'));
  if (appleAssociation) {
    const isJson = appleAssociation.headers['content-type']?.includes('application/json');
    console.log(`  Apple App Site Association: ${appleAssociation.statusCode === 200 ? '✅' : '❌'}`);
    console.log(`  Correct content-type: ${isJson ? '✅' : '❌'}`);
  }
  
  const androidLinks = results.find(r => r.url.includes('assetlinks.json'));
  if (androidLinks) {
    const isJson = androidLinks.headers['content-type']?.includes('application/json');
    console.log(`  Android App Links: ${androidLinks.statusCode === 200 ? '✅' : '❌'}`);
    console.log(`  Correct content-type: ${isJson ? '✅' : '❌'}`);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit the debug page: https://tripwiser-web-lmgo.vercel.app/debug');
  console.log('2. Check browser console for any JavaScript errors');
  console.log('3. Test the "Open App" button functionality');
  console.log('4. Verify deep links work on mobile devices');
  
  if (failed > 0) {
    console.log('\n⚠️  Issues detected! Check the failed URLs above.');
  } else {
    console.log('\n🎉 All tests passed! The deployment appears to be working correctly.');
  }
}

// Run the test
testDeployment().catch(console.error);

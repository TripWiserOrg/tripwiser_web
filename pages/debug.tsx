import React from 'react';
import Head from 'next/head';
import { ENV_CONFIG } from '../utils/deeplink';

export default function DebugPage() {
  return (
    <>
      <Head>
        <title>Debug Environment - TripWiser</title>
        <meta name="description" content="Debug page to check environment variables" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔧 Environment Debug Page</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(ENV_CONFIG, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables Check</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_APP_URL:</span>
                <span className={process.env.NEXT_PUBLIC_APP_URL ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_URL_SCHEME:</span>
                <span className={process.env.NEXT_PUBLIC_URL_SCHEME ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_URL_SCHEME || 'NOT SET'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_ANDROID_PACKAGE:</span>
                <span className={process.env.NEXT_PUBLIC_ANDROID_PACKAGE ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_ANDROID_PACKAGE || 'NOT SET'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_IOS_BUNDLE_ID:</span>
                <span className={process.env.NEXT_PUBLIC_IOS_BUNDLE_ID ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_IOS_BUNDLE_ID || 'NOT SET'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NODE_ENV:</span>
                <span className="text-blue-600">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Deep Link Generation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Path:</label>
                <input 
                  type="text" 
                  id="testPath" 
                  defaultValue="packing/68accd52f86c7d41c65b9ec9" 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Params:</label>
                <input 
                  type="text" 
                  id="testParams" 
                  defaultValue='{"viewOnly": "true", "packingListId": "68accd53f86c7d41c65b9ed0"}' 
                  className="w-full p-2 border rounded"
                />
              </div>
              <button 
                onClick={() => {
                  const path = (document.getElementById('testPath') as HTMLInputElement).value;
                  const params = JSON.parse((document.getElementById('testParams') as HTMLInputElement).value);
                  const deeplinkUrl = `${ENV_CONFIG.URL_SCHEME}${path}?${new URLSearchParams(params).toString()}`;
                  alert(`Generated Deep Link: ${deeplinkUrl}`);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate Deep Link
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-700">
              <li>Check if environment variables are set in Vercel dashboard</li>
              <li>Make sure to redeploy after adding environment variables</li>
              <li>Verify all environments (Production, Preview, Development) are selected</li>
              <li>Clear browser cache and try again</li>
              <li>Check browser console for JavaScript errors</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

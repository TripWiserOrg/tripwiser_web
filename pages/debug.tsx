import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { debug } from '../utils/debug';

export default function DebugPage() {
  const [logs, setLogs] = useState<any>({ logs: [], errors: [] });
  const [environmentInfo, setEnvironmentInfo] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setEnvironmentInfo(debug.getEnvironmentInfo());
    setLogs(debug.getLogs());

    // Update logs every 2 seconds
    const interval = setInterval(() => {
      setLogs(debug.getLogs());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    debug.clearLogs();
    setLogs({ logs: [], errors: [] });
  };

  const testLog = () => {
    debug.log('Test log from debug page', { test: true, timestamp: new Date().toISOString() });
  };

  const testError = () => {
    debug.error('Test error from debug page', new Error('Test error'));
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Debug - TripWiser</title>
        <meta name="description" content="Debug page for TripWiser" />
      </Head>

      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">TripWiser Debug Page</h1>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={testLog}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Log
              </button>
              <button
                onClick={testError}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Test Error
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear Logs
              </button>
            </div>

            {/* Environment Info */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Environment Info</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(environmentInfo, null, 2)}
                </pre>
              </div>
            </div>

            {/* Logs */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Debug Logs ({logs.logs.length})
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
                {logs.logs.length === 0 ? (
                  <p className="text-gray-500">No logs yet. Click "Test Log" to add one.</p>
                ) : (
                  <div className="space-y-2">
                    {logs.logs.map((log: any, index: number) => (
                      <div key={index} className="text-sm bg-white p-2 rounded border">
                        <div className="text-gray-600 text-xs">{log.timestamp}</div>
                        <div className="font-medium">{log.message}</div>
                        {log.data && (
                          <pre className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Errors */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Debug Errors ({logs.errors.length})
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
                {logs.errors.length === 0 ? (
                  <p className="text-gray-500">No errors yet. Click "Test Error" to add one.</p>
                ) : (
                  <div className="space-y-2">
                    {logs.errors.map((error: any, index: number) => (
                      <div key={index} className="text-sm bg-red-50 p-2 rounded border border-red-200">
                        <div className="text-gray-600 text-xs">{error.timestamp}</div>
                        <div className="font-medium text-red-800">{error.message}</div>
                        <div className="text-red-700 text-xs mt-1">{error.error}</div>
                        {error.stack && (
                          <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How to use this debug page:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• This page shows all debug logs and errors from your session</li>
                <li>• Logs are stored in localStorage and persist across page refreshes</li>
                <li>• Use this to see what's happening when the app doesn't work on Vercel</li>
                <li>• Check the Environment Info to see if you're on Vercel</li>
                <li>• Look for any errors that might be preventing the app from working</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

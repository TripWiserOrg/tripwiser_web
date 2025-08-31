// Debug utility for Vercel deployment issues

export const debug = {
  log: (message: string, data?: any) => {
    if (typeof window !== 'undefined') {
      console.log(`[DEBUG] ${message}`, data);
      // Store in localStorage for debugging
      try {
        const logs = JSON.parse(localStorage.getItem('debug_logs') || '[]');
        logs.push({
          timestamp: new Date().toISOString(),
          message,
          data,
          url: window.location.href,
          userAgent: window.navigator.userAgent
        });
        localStorage.setItem('debug_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
      } catch (e) {
        console.error('Failed to store debug log:', e);
      }
    }
  },

  error: (message: string, error?: any) => {
    if (typeof window !== 'undefined') {
      console.error(`[DEBUG ERROR] ${message}`, error);
      // Store error in localStorage
      try {
        const errors = JSON.parse(localStorage.getItem('debug_errors') || '[]');
        errors.push({
          timestamp: new Date().toISOString(),
          message,
          error: error?.message || error,
          stack: error?.stack,
          url: window.location.href,
          userAgent: window.navigator.userAgent
        });
        localStorage.setItem('debug_errors', JSON.stringify(errors.slice(-20))); // Keep last 20 errors
      } catch (e) {
        console.error('Failed to store debug error:', e);
      }
    }
  },

  getLogs: () => {
    if (typeof window !== 'undefined') {
      try {
        return {
          logs: JSON.parse(localStorage.getItem('debug_logs') || '[]'),
          errors: JSON.parse(localStorage.getItem('debug_errors') || '[]')
        };
      } catch (e) {
        return { logs: [], errors: [] };
      }
    }
    return { logs: [], errors: [] };
  },

  clearLogs: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('debug_logs');
      localStorage.removeItem('debug_errors');
    }
  },

  // Check if we're on Vercel
  isVercel: () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname.includes('vercel.app');
    }
    return false;
  },

  // Get environment info
  getEnvironmentInfo: () => {
    if (typeof window !== 'undefined') {
      return {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        cookieEnabled: window.navigator.cookieEnabled,
        onLine: window.navigator.onLine,
        platform: window.navigator.platform,
        vendor: window.navigator.vendor,
        isVercel: window.location.hostname.includes('vercel.app'),
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};

// Auto-log environment info on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    debug.log('Page loaded', debug.getEnvironmentInfo());
  });

  // Log any unhandled errors
  window.addEventListener('error', (event) => {
    debug.error('Unhandled error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  // Log unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    debug.error('Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise
    });
  });
}

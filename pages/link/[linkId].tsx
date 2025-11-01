import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  generateDeviceFingerprint,
  isMobileDevice,
  getStoreURL,
} from '../../utils/deviceFingerprint';
import { trackAttributionClick } from '../../utils/attributionApi';

interface LinkPageProps {
  linkData?: {
    linkId: string;
    affiliateType: 'elite_gift' | 'influencer_referral';
    influencerId?: string;
    isActive: boolean;
  };
}

export default function LinkPage({ linkData }: LinkPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');

  useEffect(() => {
    if (!linkData) {
      setStatus('error');
      return;
    }

    if (!linkData.isActive) {
      setStatus('error');
      return;
    }

    const handleRedirect = async () => {
      try {
        // Generate device fingerprint
        const fingerprint = generateDeviceFingerprint();

        // Track the click
        const trackingResult = await trackAttributionClick({
          fingerprint,
          affiliateType: linkData.affiliateType,
          influencerId: linkData.influencerId,
          linkId: linkData.linkId,
        });

        console.log('Attribution click tracked:', trackingResult);

        // Determine redirect URL
        let redirectUrl: string;

        if (isMobileDevice()) {
          // Redirect to appropriate app store
          redirectUrl = getStoreURL(fingerprint.platform);
        } else {
          // Redirect to download page or main website
          redirectUrl = 'https://tripwiser-web-lmgo.vercel.app/';
        }

        setStatus('redirecting');

        // Redirect after a short delay to ensure tracking completes
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } catch (error) {
        console.error('Error handling link redirect:', error);
        setStatus('error');
      }
    };

    handleRedirect();
  }, [linkData]);

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>TripWiser - Opening Link</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl font-semibold">Preparing your TripWiser experience...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'redirecting') {
    return (
      <>
        <Head>
          <title>TripWiser - Redirecting</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl font-semibold">Redirecting you to TripWiser...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Head>
          <title>TripWiser - Invalid Link</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-pink-600">
          <div className="text-center text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Oops! Invalid or Expired Link</h1>
            <p className="text-lg mb-6">
              This link is no longer valid or has expired.
            </p>
            <a
              href="https://tripwiser-web-lmgo.vercel.app/"
              className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Go to TripWiser Home
            </a>
          </div>
        </div>
      </>
    );
  }

  return null;
}

/**
 * Server-side props to fetch link data
 * This runs on the server for each request
 */
export async function getServerSideProps(context: any) {
  const { linkId } = context.params;

  try {
    // Fetch link data from your backend
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${apiUrl}/affiliate/link/${linkId}`);

    if (!response.ok) {
      return {
        props: {
          linkData: null,
        },
      };
    }

    const linkData = await response.json();

    return {
      props: {
        linkData: linkData.data,
      },
    };
  } catch (error) {
    console.error('Error fetching link data:', error);
    return {
      props: {
        linkData: null,
      },
    };
  }
}

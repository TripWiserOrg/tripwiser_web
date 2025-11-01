import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  generateDeviceFingerprint,
  isMobileDevice,
  getStoreURL,
} from '../../utils/deviceFingerprint';
import { trackAttributionClick } from '../../utils/attributionApi';

interface GiftPageProps {
  giftData?: {
    linkId: string;
    isActive: boolean;
    expiresAt?: string;
  };
}

export default function GiftPage({ giftData }: GiftPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');

  useEffect(() => {
    if (!giftData) {
      setStatus('error');
      return;
    }

    if (!giftData.isActive) {
      setStatus('error');
      return;
    }

    // Check if gift has expired
    if (giftData.expiresAt && new Date(giftData.expiresAt) < new Date()) {
      setStatus('error');
      return;
    }

    const handleRedirect = async () => {
      try {
        const fingerprint = generateDeviceFingerprint();

        await trackAttributionClick({
          fingerprint,
          affiliateType: 'elite_gift',
          linkId: giftData.linkId,
        });

        let redirectUrl: string;
        if (isMobileDevice()) {
          redirectUrl = getStoreURL(fingerprint.platform);
        } else {
          redirectUrl = 'https://tripwiser-web-lmgo.vercel.app/';
        }

        setStatus('redirecting');

        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } catch (error) {
        console.error('Error handling gift redirect:', error);
        setStatus('error');
      }
    };

    handleRedirect();
  }, [giftData]);

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>TripWiser - Elite Gift</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎁</div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-2xl font-bold">You've received an Elite Gift!</p>
            <p className="text-lg mt-2">Preparing your exclusive offer...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'redirecting') {
    return (
      <>
        <Head>
          <title>TripWiser - Claiming Gift</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎁</div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-2xl font-bold">Redirecting to claim your gift...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Head>
          <title>TripWiser - Gift Unavailable</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-500 to-gray-700">
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold mb-4">Gift Unavailable</h1>
            <p className="text-lg mb-6">
              This gift link is invalid, expired, or has already been used.
            </p>
            <a
              href="https://tripwiser-web-lmgo.vercel.app/"
              className="inline-block bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
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

export async function getServerSideProps(context: any) {
  const { giftId } = context.params;

  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const response = await fetch(`${apiUrl}/affiliate/gift/${giftId}`);

    if (!response.ok) {
      return { props: { giftData: null } };
    }

    const giftData = await response.json();
    return { props: { giftData: giftData.data } };
  } catch (error) {
    console.error('Error fetching gift data:', error);
    return { props: { giftData: null } };
  }
}

import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface TripPageProps {
  tripId: string;
  viewOnly?: string;
}

export default function TripPage({ tripId, viewOnly }: TripPageProps) {
  const pathname = `/trip/${tripId}`;
  const searchParams: Record<string, string> = {};
  
  if (viewOnly) {
    searchParams.viewOnly = viewOnly as string;
  }

  return (
    <>
      <Head>
        <title>Trip Details - TripWiser</title>
        <meta name="description" content="View trip details in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser-web-lmgo.vercel.app/trip/${tripId}`} />
        <meta property="og:title" content="Trip Details - TripWiser" />
        <meta property="og:description" content="View trip details in TripWiser" />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser-web-lmgo.vercel.app/trip/${tripId}`} />
        <meta property="twitter:title" content="Trip Details - TripWiser" />
        <meta property="twitter:description" content="View trip details in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParams} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const { viewOnly } = context.query;

  return {
    props: {
      tripId: id,
      viewOnly: viewOnly || null,
    },
  };
};


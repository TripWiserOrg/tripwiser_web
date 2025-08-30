import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface PackingPageProps {
  tripId: string;
  viewOnly?: string;
  packingListId?: string;
}

export default function PackingPage({ tripId, viewOnly, packingListId }: PackingPageProps) {
  const pathname = `/packing/${tripId}`;
  const searchParams: Record<string, string> = {};
  
  if (viewOnly) {
    searchParams.viewOnly = viewOnly as string;
  }
  
  if (packingListId) {
    searchParams.packingListId = packingListId as string;
  }

  return (
    <>
      <Head>
        <title>Packing List - TripWiser</title>
        <meta name="description" content="View packing list in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/packing/${tripId}`} />
        <meta property="og:title" content="Packing List - TripWiser" />
        <meta property="og:description" content="View packing list in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/packing/${tripId}`} />
        <meta property="twitter:title" content="Packing List - TripWiser" />
        <meta property="twitter:description" content="View packing list in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser.app/og-image.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParams} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const { viewOnly, packingListId } = context.query;

  return {
    props: {
      tripId: id,
      viewOnly: viewOnly || null,
      packingListId: packingListId || null,
    },
  };
};


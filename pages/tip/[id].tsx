import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface TipPageProps {
  tipId: string;
  viewOnly?: string;
}

export default function TipPage({ tipId, viewOnly }: TipPageProps) {
  const pathname = `/tip/${tipId}`;
  const searchParams = new URLSearchParams();
  
  if (viewOnly) {
    searchParams.set('viewOnly', viewOnly);
  }

  return (
    <>
      <Head>
        <title>Travel Tip - TripWiser</title>
        <meta name="description" content="View travel tip in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/tip/${tipId}`} />
        <meta property="og:title" content="Travel Tip - TripWiser" />
        <meta property="og:description" content="View travel tip in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/tip/${tipId}`} />
        <meta property="twitter:title" content="Travel Tip - TripWiser" />
        <meta property="twitter:description" content="View travel tip in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser.app/og-image.png" />
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
      tipId: id,
      viewOnly: viewOnly || null,
    },
  };
};


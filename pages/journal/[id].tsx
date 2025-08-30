import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface JournalPageProps {
  tripId: string;
  viewOnly?: string;
  entryId?: string;
}

export default function JournalPage({ tripId, viewOnly, entryId }: JournalPageProps) {
  const pathname = `/journal/${tripId}`;
  const searchParams: Record<string, string> = {};
  
  if (viewOnly) {
    searchParams.viewOnly = viewOnly as string;
  }
  
  if (entryId) {
    searchParams.entryId = entryId as string;
  }

  return (
    <>
      <Head>
        <title>Travel Journal - TripWiser</title>
        <meta name="description" content="View travel journal in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/journal/${tripId}`} />
        <meta property="og:title" content="Travel Journal - TripWiser" />
        <meta property="og:description" content="View travel journal in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/journal/${tripId}`} />
        <meta property="twitter:title" content="Travel Journal - TripWiser" />
        <meta property="twitter:description" content="View travel journal in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser.app/og-image.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParams} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const { viewOnly, entryId } = context.query;

  return {
    props: {
      tripId: id,
      viewOnly: viewOnly || null,
      entryId: entryId || null,
    },
  };
};


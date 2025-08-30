import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface ItineraryPageProps {
  tripId: string;
  viewOnly?: string;
  itineraryId?: string;
}

export default function ItineraryPage({ tripId, viewOnly, itineraryId }: ItineraryPageProps) {
  const pathname = `/itinerary/${tripId}`;
  const searchParams: Record<string, string> = {};
  
  if (viewOnly) {
    searchParams.viewOnly = viewOnly as string;
  }
  
  if (itineraryId) {
    searchParams.itineraryId = itineraryId as string;
  }

  return (
    <>
      <Head>
        <title>Trip Itinerary - TripWiser</title>
        <meta name="description" content="View trip itinerary in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/itinerary/${tripId}`} />
        <meta property="og:title" content="Trip Itinerary - TripWiser" />
        <meta property="og:description" content="View trip itinerary in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/itinerary/${tripId}`} />
        <meta property="twitter:title" content="Trip Itinerary - TripWiser" />
        <meta property="twitter:description" content="View trip itinerary in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser.app/og-image.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParams} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const { viewOnly, itineraryId } = context.query;

  return {
    props: {
      tripId: id,
      viewOnly: viewOnly || null,
      itineraryId: itineraryId || null,
    },
  };
};


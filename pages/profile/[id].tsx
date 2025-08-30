import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface ProfilePageProps {
  userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const pathname = `/profile/${userId}`;
  const searchParams: Record<string, string> = {};

  return (
    <>
      <Head>
        <title>User Profile - TripWiser</title>
        <meta name="description" content="View user profile in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/profile/${userId}`} />
        <meta property="og:title" content="User Profile - TripWiser" />
        <meta property="og:description" content="View user profile in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/profile/${userId}`} />
        <meta property="twitter:title" content="User Profile - TripWiser" />
        <meta property="twitter:description" content="View user profile in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser.app/og-image.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParams} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      userId: id,
    },
  };
};


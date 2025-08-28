import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../../components/RedirectHandler';

interface DiscoverPostPageProps {
  postId: string;
}

export default function DiscoverPostPage({ postId }: DiscoverPostPageProps) {
  const pathname = `/discover/post/${postId}`;

  return (
    <>
      <Head>
        <title>Discovery Post - TripWiser</title>
        <meta name="description" content="View discovery post in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/discover/post/${postId}`} />
        <meta property="og:title" content="Discovery Post - TripWiser" />
        <meta property="og:description" content="View discovery post in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/discover/post/${postId}`} />
        <meta property="twitter:title" content="Discovery Post - TripWiser" />
        <meta property="twitter:description" content="View discovery post in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser.app/og-image.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      postId: id,
    },
  };
};


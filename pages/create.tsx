import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../components/RedirectHandler';

interface CreatePageProps {
  type?: string;
}

export default function CreatePage({ type }: CreatePageProps) {
  const pathname = '/create';
  const searchParams: Record<string, string> = {};
  
  if (type) {
    searchParams.type = type as string;
  }

  return (
    <>
      <Head>
        <title>Create Trip - TripWiser</title>
        <meta name="description" content="Create a new trip in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tripwiser-web-lmgo.vercel.app/create" />
        <meta property="og:title" content="Create Trip - TripWiser" />
        <meta property="og:description" content="Create a new trip in TripWiser" />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tripwiser-web-lmgo.vercel.app/create" />
        <meta property="twitter:title" content="Create Trip - TripWiser" />
        <meta property="twitter:description" content="Create a new trip in TripWiser" />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParams} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { type } = context.query;

  return {
    props: {
      type: type || null,
    },
  };
};


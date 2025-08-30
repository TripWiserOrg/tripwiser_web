import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../../components/RedirectHandler';

interface TemplatePageProps {
  templateId: string;
}

export default function TemplatePage({ templateId }: TemplatePageProps) {
  const pathname = `/template/${templateId}`;
  const searchParams: Record<string, string> = {};

  return (
    <>
      <Head>
        <title>Trip Template - TripWiser</title>
        <meta name="description" content="View trip template in TripWiser" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser.app/template/${templateId}`} />
        <meta property="og:title" content="Trip Template - TripWiser" />
        <meta property="og:description" content="View trip template in TripWiser" />
        <meta property="og:image" content="https://tripwiser.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser.app/template/${templateId}`} />
        <meta property="twitter:title" content="Trip Template - TripWiser" />
        <meta property="twitter:description" content="View trip template in TripWiser" />
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
      templateId: id,
    },
  };
};


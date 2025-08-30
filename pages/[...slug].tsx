import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../components/RedirectHandler';
import { parseUrlPath, getPageTitle, getPageDescription } from '../utils/deeplink';

interface DynamicPageProps {
  pathname: string;
  searchParams: string;
  pageTitle: string;
  pageDescription: string;
}

export default function DynamicPage({ pathname, searchParams, pageTitle, pageDescription }: DynamicPageProps) {
  const searchParamsObj = new URLSearchParams(searchParams);

  return (
    <>
      <Head>
        <title>{pageTitle} - TripWiser</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser-web-lmgo.vercel.app${pathname}`} />
        <meta property="og:title" content={`${pageTitle} - TripWiser`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser-web-lmgo.vercel.app${pathname}`} />
        <meta property="twitter:title" content={`${pageTitle} - TripWiser`} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/og-image.png" />
      </Head>
      
      <RedirectHandler pathname={pathname} searchParams={searchParamsObj} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string[] };
  const pathname = '/' + slug.join('/');
  
  // Parse the URL to get page info
  const parsed = parseUrlPath(pathname);
  
  if (!parsed) {
    // Invalid URL, redirect to home
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const pageTitle = getPageTitle(parsed.type, parsed.id);
  const pageDescription = getPageDescription(parsed.type, parsed.id);
  
  // Convert query params to string
  const searchParams = new URLSearchParams();
  Object.entries(context.query).forEach(([key, value]) => {
    if (key !== 'slug' && value) {
      searchParams.set(key, Array.isArray(value) ? value[0] : value);
    }
  });

  return {
    props: {
      pathname,
      searchParams: searchParams.toString(),
      pageTitle,
      pageDescription,
    },
  };
};

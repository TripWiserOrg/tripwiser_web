import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import RedirectHandler from '../components/RedirectHandler';
import { parseUrlPath, getPageTitle, getPageDescription, buildDeeplinkUrl, buildAppPath } from '../utils/deeplink';

interface DynamicPageProps {
  pathname: string;
  searchParams: string;
  pageTitle: string;
  pageDescription: string;
  deeplinkUrl?: string;
}

export default function DynamicPage({ pathname, searchParams, pageTitle, pageDescription, deeplinkUrl }: DynamicPageProps) {
  // Convert URLSearchParams string to Record<string, string>
  const searchParamsObj: Record<string, string> = {};
  const params = new URLSearchParams(searchParams);
  params.forEach((value, key) => {
    searchParamsObj[key] = value;
  });

  return (
    <>
      <Head>
        <title>{pageTitle} - TripWiser</title>
        <meta name="description" content={pageDescription} />
        
        {/* Meta refresh for automatic app opening */}
        {deeplinkUrl && (
          <meta httpEquiv="refresh" content={`0;url=${deeplinkUrl}`} />
        )}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tripwiser-web-lmgo.vercel.app${pathname}`} />
        <meta property="og:title" content={`${pageTitle} - TripWiser`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://tripwiser-web-lmgo.vercel.app${pathname}`} />
        <meta property="twitter:title" content={`${pageTitle} - TripWiser`} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content="https://tripwiser-web-lmgo.vercel.app/branding/logo.png" />
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

  // Build the deeplink URL for meta refresh
  let deeplinkUrl = undefined;
  try {
    const appPath = buildAppPath(parsed.type, parsed.id, parsed.params);
    if (appPath) {
      const params: any = { ...parsed.params };
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      deeplinkUrl = buildDeeplinkUrl(appPath, params);
    }
  } catch (error) {
    console.error('Error building deeplink URL:', error);
  }

  return {
    props: {
      pathname,
      searchParams: searchParams.toString(),
      pageTitle,
      pageDescription,
      deeplinkUrl,
    },
  };
};

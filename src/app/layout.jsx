import { Geist, Geist_Mono, Jost } from "next/font/google";
import Script from "next/script";
import { AppProvider } from "./context/AppContext";
import ThemeRegistry from "@/app/components/ThemeRegistry";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import LayoutErrorBoundary from "@/app/components/LayoutErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["monospace"],
  adjustFontFallback: true,
});

const jostSans = Jost({
  variable: "--font-jost-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_STORE_NAME || "Loja Online",
  description: process.env.NEXT_PUBLIC_STORE_DESCRIPTION || "Promoções, compre online, conheça nossas lojas e muito mais....",
  keywords: process.env.NEXT_PUBLIC_STORE_KEYWORDS || "loja online, e-commerce",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
    siteName: process.env.NEXT_PUBLIC_STORE_NAME || "Loja Online",
    title: process.env.NEXT_PUBLIC_STORE_NAME || "Loja Online",
    description: process.env.NEXT_PUBLIC_STORE_DESCRIPTION || "Promoções, compre online, conheça nossas lojas e muito mais...",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org/",
  "@type": "WebSite",
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Loja Online",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"}/busca/{search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable} ${jostSans.variable}`}>
      <head>
        <link rel="preload" href="/favicon/favicon-96x96.png" as="image" type="image/png" />
        <link rel="preload" href="/favicon/favicon.svg" as="image" type="image/svg+xml" />

        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://apis.google.com" />

        {/* <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" media="print" /> */}

        <meta name="sb.validation_hash" content="BLI-GSFqRyiDsYxatDYyHyapSKSLCQplTtdCzjWmkTIMSusKGOXSObNWkdTBhJloedADdRsKUQfyMlbsuJXByWyIEgAJDakAoHPJ" />
      </head>
      <body>
        <LayoutErrorBoundary>
          <AppProvider>
            <ThemeRegistry>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ThemeRegistry>
          </AppProvider>
        </LayoutErrorBoundary>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* <GoogleTagManager gtmId="GTM-P7FFP62" /> */}

        {/* <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P7FFP62" height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
        </noscript> */}

        <Script src="https://apis.google.com/js/platform.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

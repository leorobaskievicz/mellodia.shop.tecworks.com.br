import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => Date.now().toString(),
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 180,
  compress: true,
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "divacosmeticos.com" },
      { protocol: "https", hostname: "api.divacosmeticos.com" },
      { protocol: "https", hostname: "api.tecworks.com.br" },
      { protocol: "https", hostname: "dvy6d7mpp8is.cloudfront.net" },
      { protocol: "https", hostname: "cdn.divacosmeticos.com.br" },
      { protocol: "https", hostname: "play.google.com" },
      { protocol: "https", hostname: "apisite.tecworks.com.br" },
    ],
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizeCss: true,
  },
  headers: async () => {
    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

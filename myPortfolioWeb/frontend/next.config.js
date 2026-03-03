/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      // Add your production domains here
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async redirects() {
    return [
      { source: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.PDF', destination: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.pdf', permanent: true },
      { source: '/AGBAOSI BOLARINWA MINASU MYSTERY CV.PDF', destination: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.pdf', permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/cv.pdf', destination: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.pdf' },
        { source: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.PDF', destination: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.pdf' },
        { source: '/AGBAOSI BOLARINWA MINASU MYSTERY CV.PDF', destination: '/AGBAOSI%20BOLARINWA%20MINASU%20MYSTERY%20CV.pdf' },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;

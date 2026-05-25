/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce dev file-system overhead on slow drives (suppresses benchmark warning)
  devIndicators: false,

  // Improve resilience on slow connections: extend fetch/render timeouts
  staticPageGenerationTimeout: 120,

  // Image optimization for slow networks
  images: {
    minimumCacheTTL: 86400,
    formats: ['image/webp', 'image/avif'],
  },

  // Compress responses for bandwidth-constrained clients
  compress: true,

  // Fine-tune headers for caching and offline support
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/api/matches',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=10, s-maxage=10, stale-while-revalidate=30' },
        ],
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Prisma needs this for serverless deployment
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/.prisma/client/**'],
    '/admin/**': ['./node_modules/.prisma/client/**'],
  },
  // Stripe webhook needs raw body
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;

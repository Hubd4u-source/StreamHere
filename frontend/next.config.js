/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const dest = process.env.NEXT_PUBLIC_API_URL;
    if (dest && dest.trim().length > 0) {
      const base = dest.replace(/\/$/, '');
      return [{ source: '/api/:path*', destination: `${base}/api/:path*` }];
    }
    return [];
  },
};

module.exports = nextConfig;


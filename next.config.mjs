/** @type {import('next').NextConfig} */

const path = require ? require('path') : (await import('path')).default;

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'standalone', // Cloudflare Pages에서는 standalone output이 필요하지 않으므로 제거
  productionBrowserSourceMaps: false,
  experimental: {
    // Cloudflare Pages 최적화: tracing root만 지정, 불필요한 exclude는 제거 가능
    outputFileTracingRoot: path.resolve(__dirname),
  },
};

export default nextConfig;

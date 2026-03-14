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
  output: 'standalone',
  productionBrowserSourceMaps: false,
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname),
    outputFileTracingExcludes: {
      // node_modules 전체, server, scripts, docs 등 불필요한 폴더 제외
      './node_modules/**': ['**/*'],
      './server/**': ['**/*'],
      './scripts/**': ['**/*'],
      './docs/**': ['**/*'],
      './build/**': ['**/*'],
      './test/**': ['**/*'],
    },
  },
};

export default nextConfig;

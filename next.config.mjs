import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: path.resolve(process.cwd()),
};

export default nextConfig;

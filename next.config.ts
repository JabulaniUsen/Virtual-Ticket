import { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['via.placeholder.com'],
  },

  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

export default nextConfig;

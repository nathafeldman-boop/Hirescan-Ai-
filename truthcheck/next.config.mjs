/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    ],
  },
  // Don't expose source maps in prod
  productionBrowserSourceMaps: false,
};

export default nextConfig;

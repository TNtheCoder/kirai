/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
      },
    ],
  },
  webpack(config: any, { dev }: { dev: boolean }) {
    // Disable source maps in development mode
    if (dev) {
      config.devtool = false;  // This will stop generating source maps in dev mode
    }
    return config;
  },
};

export default nextConfig;

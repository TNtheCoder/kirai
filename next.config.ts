/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
      remotePatterns: [{
          protocol: 'https',
          hostname: '**.cloudinary.com',
          port: '',
      }]
  }
};

export default nextConfig;

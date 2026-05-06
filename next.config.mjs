/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — product images uploaded via /seller/upload/image
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Catch-all for any other https image source during dev
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;

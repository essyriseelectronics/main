/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Whitelists all HTTPS images. For production, replace '**' with your R2 domain (e.g., 'pub-abc123xyz.r2.dev')
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-36d21ae1f39f456e8133f83f35c0ef4d.r2.dev',
        port: '',
        pathname: '/**', // This allows any image path inside your specific R2 bucket
      },
    ],
  },
};

export default nextConfig;

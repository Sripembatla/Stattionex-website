/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fashionmateai.s3.eu-north-1.amazonaws.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // Add Pexels domain here
        pathname: "/photos/**", // Match the path for Pexels images
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
        pathname: "/fashionmate.media/assets/**",
      },
    ],
    domains: ['static.vecteezy.com'],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Frontend API URL
        destination: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/:path*`, // Backend API URL
      },
    ];
  },
};

export default nextConfig;

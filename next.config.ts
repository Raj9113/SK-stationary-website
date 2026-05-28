/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      '192.168.31.250',
      '192.168.31.250:3000',
      'localhost:3000'
    ]
  }
};

export default nextConfig;
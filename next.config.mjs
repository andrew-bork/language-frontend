/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/tokenize/jp',
        destination: 'http://localhost:8000/tokenize/jp',
      },
    ]
  },
};

export default nextConfig;

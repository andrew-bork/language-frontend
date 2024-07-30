/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/tokenize/jp',
        destination: 'http://127.0.0.1:8000/tokenize/jp',
      },
    ]
  },
};

export default nextConfig;

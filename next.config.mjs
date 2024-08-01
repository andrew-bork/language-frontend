/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/tokenize/jp',
        destination: 'http://127.0.0.1:8000/tokenize/jp',
      },
      {
        source: '/api/term/jp/:term',
        destination: 'http://127.0.0.1:8001/term/jp/:term',
      },
      {
        source: '/api/kanji/jp/:term',
        destination: 'http://127.0.0.1:8000/kanji/jp/:term',
      },
    ]
  },
};

export default nextConfig;

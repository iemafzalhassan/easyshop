/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  swcMinify: true,
  experimental: {
    serverActions: true
  }
};

module.exports = config; 
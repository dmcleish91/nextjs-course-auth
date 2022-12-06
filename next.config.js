/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    mongoDBuser: 'nextWolf',
    mongoDBpassword: 'KWXww0RYXFY06sQT'
  }
};

module.exports = nextConfig;

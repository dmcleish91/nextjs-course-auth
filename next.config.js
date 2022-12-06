/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    mongoDBuser: '',
    mongoDBpassword: ''
  }
};

module.exports = nextConfig;

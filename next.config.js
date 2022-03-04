/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  removeConsole: true,
  swcMinify: true,
  images: {
    domains: ["prportal.nidw.gov.bd"],
  },
};

module.exports = nextConfig;

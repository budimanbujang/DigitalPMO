/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/DigitalPMO',
  trailingSlash: true,
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,

  output: 'export',

  reactStrictMode: true,

  experimental: {
    appDir: true,
  },

  experimental: {
    appDir: true,
  },

  compiler: {
    styledComponents: true,
  },

  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   trailingSlash: false,
//   output: 'export',
//   distDir: process.env.NODE_ENV === 'production' ? '.build' : '.next',
//   reactStrictMode: true,
//   experimental: {
//     appDir: true,
//   },
//   compiler: {
//     styledComponents: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// module.exports = nextConfig
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  basePath: isProd ? '/cms' : '',
  assetPrefix: isProd ? '/cms/' : '',
  images: {
    unoptimized: true,
    path: isProd ? '/cms/' : '/',
    loader: 'default',
  },
  trailingSlash: true,
}

module.exports = nextConfig
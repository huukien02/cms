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


const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/cms' : '',  assetPrefix: isProd ? '/cms/' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
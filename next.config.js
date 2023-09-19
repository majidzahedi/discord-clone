/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts')
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    return config
  },
  output: 'standalone',
  images: {
    domains: ['s3.ir-thr-at1.arvanstorage.ir', 'utfs.io'],
  },
}

module.exports = withNextIntl(nextConfig)

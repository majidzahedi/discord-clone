/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts')
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['s3.ir-thr-at1.arvanstorage.ir', 'utfs.io'],
  },
}

module.exports = withNextIntl(nextConfig)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: 'loose', // Esta opción permite la compatibilidad con ESM
  },
}

module.exports = nextConfig

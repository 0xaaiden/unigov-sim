/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    mode: process.env.NODE_ENV,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig

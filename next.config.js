/** @type {import('next').NextConfig} */
const rewrites = () => {
  return [
    {
      source: '/api/:path*',
      destination: 'http://127.0.0.1:8000/api/:path*' // Proxy to Backend
    }
  ]
}
const nextConfig = {
  experimental: { appDir: true },
  transpilePackages: [
    '@datalayer/jupyterlite-server',
    '@datalayer/jupyter-react',
    'yjs',
    'y-protocols'
  ],
  reactStrictMode: false,
  rewrites
}

module.exports = nextConfig

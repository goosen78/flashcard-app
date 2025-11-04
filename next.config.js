/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration for better-sqlite3
  turbopack: {},
  webpack: (config) => {
    // Handle better-sqlite3 native module for webpack builds
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3'
    });
    return config;
  },
}

module.exports = nextConfig

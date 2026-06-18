/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: true, // Indique que la redirection est permanente (SEO Friendly)
      },
    ];
  },
};

export default nextConfig;
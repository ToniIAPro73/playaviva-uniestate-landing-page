/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Configurar las calidades permitidas
    qualities: [60, 75],
    // Si usas dominios externos, añádelos aquí
    // domains: ['example.com'],
  },
};

module.exports = nextConfig;

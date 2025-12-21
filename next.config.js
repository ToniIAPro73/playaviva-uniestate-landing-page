/**
 * Next.js Configuration for Meridian Coastal Group - Azure Bay District Landing Page
 * 
 * Optimized for:
 * - Premium real estate landing page performance
 * - Lead automation and CRM integration
 * - Mobile-first responsive design
 * - Global deployment with Vercel
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Image optimization settings
  images: {
    // Optimize image quality for web delivery
    // 60: Mobile & low-bandwidth, 75: Desktop & high-quality
    qualities: [60, 75],
    
    // External image domains (if using remote images)
    // Example: domains: ['cdn.example.com', 'images.example.com']
    // domains: [],
    
    // Device sizes for responsive image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // TypeScript configuration
  typescript: {
    // Ignore TypeScript build errors during development
    // Set to false in production for strict type checking
    ignoreBuildErrors: true,
  },

  // Disable source maps in production for smaller bundle size
  productionBrowserSourceMaps: false,

  // Performance optimizations (Next.js 16)
  experimental: {
    // Optimize imports from specific packages
    optimizePackageImports: [
      'lucide-react',      // Icon library
      'zod',               // Schema validation
      'react-hook-form',   // Form state management
    ],
  },

  // Custom HTTP headers for caching and security
  async headers() {
    return [
      // ==================== CACHING STRATEGY ====================
      
      // External CDN resources (minified JS/CSS) - Cache for 1 year
      {
        source: '/(.*)\\.min\\.(js|css)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },

      // Static assets (images, fonts) - Cache for 1 year
      // Used for hero images, logos, and design assets
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },

      // Next.js static chunks - Cache for 1 year
      // Includes compiled JS and CSS chunks
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },

      // Public folder assets - Cache for 1 year
      // Favicon, manifest, robots.txt, etc.
      {
        source: '/:path*.@(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },

      // HTML pages - Cache for 1 hour
      // Allows for content updates without long cache periods
      {
        source: '/:path*.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      },

      // API routes - No caching
      // Essential for lead submission and real-time data
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },

      // ==================== SECURITY HEADERS ====================
      
      // Apply security headers to all routes
      {
        source: '/:path*',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Prevent clickjacking attacks
          // DENY: Page cannot be displayed in a frame
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Enable XSS protection in older browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer policy for privacy
          // Only send referrer when navigating to HTTPS from HTTPS
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions policy (formerly Feature-Policy)
          // Restrict sensitive features like camera, microphone, etc.
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ];
  },

  // Redirect configuration for URL management
  async redirects() {
    return [
      // Redirect old domains to new domain (if needed)
      // {
      //   source: '/:path*',
      //   destination: 'https://meridian-coastal-group.vercel.app/:path*',
      //   permanent: true,
      // },
    ];
  },

  // Rewrite configuration for API proxying
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite patterns here for internal API routes
      ],
    };
  },
};

module.exports = nextConfig;

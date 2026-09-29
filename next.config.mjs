/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker/Coolify dağıtımı için: .next/standalone altında kendi kendine yeten
  // bir Node sunucusu üretir, runtime imajında node_modules taşımaya gerek kalmaz.
  output: 'standalone',

  // Performance optimizations
  compress: true,
  
  // Image optimization
  images: {
    // Yalnız WebP: AVIF dönüşümü küçük container'da çok CPU/RAM harcıyor (OOM) ve
    // tek format olması CDN (Cloudflare) cache'ini tarayıcıdan bağımsız güvenli kılar.
    formats: ['image/webp'],
    // Kaynak ekran görüntüleri en fazla 1920 px; daha büyük varyant üretilmez.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimize edilmiş görsel 30 gün geçerli (her 60 sn'de yeniden üretilmesin).
    minimumCacheTTL: 2592000,
  },
  
  // Eski adresler kalıcı olarak yeni Türkçe adreslere yönlenir.
  async redirects() {
    return [
      {
        source: '/cerez-politikasi',
        destination: '/kvkk/cerez-politikasi',
        permanent: true,
      },
      { source: '/about', destination: '/hakkimizda', permanent: true },
      { source: '/download', destination: '/indir', permanent: true },
      { source: '/privacy', destination: '/gizlilik-politikasi', permanent: true },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
  // GitHub Pages는 /repository-name 경로를 사용하므로 basePath 설정
  // 저장소 이름이 'British-Speak'이면 basePath를 '/British-Speak'으로 설정
  // basePath: process.env.NODE_ENV === 'production' ? '/British-Speak' : '',
  // trailingSlash: true,
};

export default nextConfig;


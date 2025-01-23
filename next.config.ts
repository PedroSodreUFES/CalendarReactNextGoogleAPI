import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  pageExtensions: [
    'page.tsx',
    'api.ts',
    'api.tsx',
  ],// somente essas extensoes irao gerar paginas, logo styles nao ira gerar 
  // deve-se mudar o app e o document para .page.tsx
};

export default nextConfig;

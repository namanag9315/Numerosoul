/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@xenova/transformers",
      "onnxruntime-node",
      "pdf-parse",
    ],
  },
};

export default nextConfig;

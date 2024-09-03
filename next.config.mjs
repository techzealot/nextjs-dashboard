import path from "path";
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: "incremental",
    swcPlugins: [["@onlook/nextjs", { root: path.resolve(".") }]],
  },
};

export default nextConfig;

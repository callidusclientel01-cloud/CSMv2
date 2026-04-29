import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: "./"
  },
  async redirects() {
    try {
      const redirectsPath = path.join(process.cwd(), 'redirects.json');
      const redirectsData = fs.readFileSync(redirectsPath, 'utf8');
      const redirects = JSON.parse(redirectsData);
      return redirects;
    } catch (e) {
      console.error("Failed to load redirects.json", e);
      return [];
    }
  }
};

export default nextConfig;

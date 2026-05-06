import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import fs from "fs";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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

export default withNextIntl(nextConfig);

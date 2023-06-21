// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/launchpad/:team/skills",
        destination: "/launchpad/:team/skills/summary",
        permanent: true,
      },
      {
        source: "/launchpad/:team/reports",
        destination: "/launchpad/:team/reports/summary",
        permanent: true,
      },
    ];
  },
};
export default config;

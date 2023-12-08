"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export function Analytics() {
  return <SpeedInsights />;
}

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(String(process.env.NEXT_PUBLIC_POSTHOG_KEY), {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export default function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

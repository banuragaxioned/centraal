import { DashboardHeader } from "@/components/ui/header";
import { DashboardShell } from "@/components/ui/shell";
import type { Metadata } from "next";
import { pageProps } from "@/types";

export const metadata: Metadata = {
  title: `Manage Milestones`,
};

export default async function Page({ params }: pageProps) {
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Project Milestones" text="Manage your milestone here"></DashboardHeader>
      </DashboardShell>
    </>
  );
}

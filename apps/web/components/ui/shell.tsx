import * as React from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn("mb-8 grid items-start gap-4 p-2", className)} {...props}>
      {children}
    </div>
  );
}

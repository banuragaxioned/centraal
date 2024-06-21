"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientStatuses } from "@/config/filters";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { ListRestart } from "lucide-react";
import { DataTableToolbarProps } from "@/types";
import { removeDuplicatesFromArray } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export function DataTableToolbar<TData extends { clientName: string }>({ table }: DataTableToolbarProps<TData>) {
  const client = useSearchParams().get("client");
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const isFiltered = table.getState().columnFilters.length > 0 || status;

  const uniqueClientList = removeDuplicatesFromArray(
    table.options.data.map((client: { clientName: string }) => client.clientName) as [],
  );
  const clientList = uniqueClientList.map((name: string) => ({
    label: name,
    value: name,
  }));

  useEffect(() => {
    client && table.getColumn("clientName")?.setFilterValue(Array(client));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-between gap-x-3 rounded-xl border border-dashed p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by project name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="w-40 lg:w-64"
        />
        {table.getColumn("clientName") && (
          <DataTableFacetedFilter column={table.getColumn("clientName")} title="Client" options={clientList} />
        )}
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`?${new URLSearchParams({
              status: status === "all" ? "" : "all",
            })}`}
          >
            Show {status === "all" ? "Published" : "All"}
          </Link>
        </Button>
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <ListRestart className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

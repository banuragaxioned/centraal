"use client";

import * as React from "react";
import { useRef } from "react";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { DataTableStructure } from "@/components/data-table/structure";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./toolbar";
import { Client } from "@/types";

export interface TableProps<TData, TValue> {
  clientName: Function;
  data: TData[];
  team: string;
}

export function Table<TData, TValue>({ clientName, data, team }: TableProps<Client, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = React.useState<number>(0);
  const showToast = useToast();
  const router = useRouter();

  const refButton = React.useRef<HTMLButtonElement>(null);

  const rowClickHandler = (row: Row<Client>) => location.assign(`projects?client=${row.original.name}`);

  const editClientNames = async (id: number, value: string) => {
    const response = await fetch("/api/team/client/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: value,
        team,
      }),
    });

    if (response?.ok) showToast("Client name updated", "success");

    router.refresh();
    setIsEditing(0);
  };

  const tableConfig = {
    data,
    columns: clientName(editClientNames, isEditing, setIsEditing, refButton),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  };

  return (
    <DataTableStructure
      tableConfig={tableConfig}
      DataTableToolbar={DataTableToolbar}
      rowClickHandler={rowClickHandler}
      rowProps={{ className: "cursor-pointer group hover:bg-accent" }}
    />
  );
}

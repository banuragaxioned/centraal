"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Dispatch } from "react";
import { Edit, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

export function clientName(
  editClientNames: (id: number, name: string) => void,
  isEditing: number,
  setIsEditing: Dispatch<number>,
  refButton: any,
) {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return isEditing === row.original.id ? (
          <Input
            defaultValue={row.original.name}
            ref={refButton}
            className={`h-auto w-auto py-1 ${isEditing ? "border border-gray-50" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsEditing(0);
              }
              if (e.key === "Enter") {
                editClientNames(isEditing, refButton?.current?.value);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex h-auto w-auto rounded-md border border-transparent py-1 text-sm">
            {row.original.name}
          </span>
        );
      },
    },
    {
      accessorKey: "project",
      meta: {
        className: "w-[25%]",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active Projects" />,
      cell: ({ row }) => <span className="block w-full pl-[15%] tabular-nums">{row.original.project}</span>,
    },
    {
      accessorKey: "status",
      meta: {
        className: "w-[25%]",
      },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      filterFn: "arrIncludesSome",
    },
    {
      id: "edit",
      meta: {
        className: "w-[100px]",
      },
      cell: ({ row }) => {
        return (
          <div className="invisible flex items-center gap-x-3 group-hover:visible" onClick={(e) => e.stopPropagation()}>
            {isEditing === row.original.id ? (
              <Button
                title="Save"
                className="h-7 w-7 border-none bg-transparent p-0 text-primary hover:text-primary-foreground"
                onClick={() => {
                  setIsEditing(row.original.id);
                  if (row.original.name !== refButton?.current?.value) {
                    editClientNames(isEditing, refButton?.current?.value);
                  } else {
                    setIsEditing(0);
                  }
                }}
                size="icon"
              >
                <Save size={14} />
              </Button>
            ) : (
              <Button
                title="Edit"
                className="h-7 w-7 border-none bg-transparent p-0 text-primary hover:text-primary-foreground"
                onClick={() => setIsEditing(row.original.id)}
                size="icon"
              >
                <Edit size={14} />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
}

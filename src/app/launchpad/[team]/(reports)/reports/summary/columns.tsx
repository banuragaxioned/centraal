"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Project =  {
  id:number,
  name:string,
  budget:number,
  logged:number,
  lead:string,
  leadImage:string
}

type Summary = {
  id: number,
  name: string,
  projects:Project[]|null,
  lead:string|null,
  leadImage:string|null,
  budget:number|null,
  logged:number|null
};

export const columns: ColumnDef<Summary>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="link" className="text-slate-500">
         Project
        </Button>
      );
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button variant="link" className="hover:no-underline text-slate-500 cursor-default">
          Budget
        </Button>
      );
    },
  },
  {
    accessorKey: "logged",
    header: ({ column }) => {
      return (
        <Button variant="link" className="hover:no-underline text-slate-500 cursor-default">
          Logged
        </Button>
      );
    },
  },
  {
    accessorKey: "lead",
    header: ({ column }) => {
      return (
        <Button variant="link" className="hover:no-underline text-slate-500 cursor-default">
          Project Leads
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original.lead;

      return (
        lead &&
        <div className="flex gap-3">
          <Button className="border-0 bg-inherit p-0">
            <Archive height={18} width={18} />
          </Button>
        </div>
      );
    },
  },
];

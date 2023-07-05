"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Assignment } from "@/types";
import { ColumnPopover } from "@/components/ui/columnPopover";

import * as React from "react";
import { DatePicker } from "@/components/datePicker";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  tableData: TData[];
}

//function to get date between two dates
const getDatesInRange = (startDate: any, endDate: any, includeWeekend: boolean) => {
  const dates = [];
  let start = startDate,
    end = endDate;
  while (start <= end) {
    const currentDate = new Date(start);
    (includeWeekend ? true : currentDate.getDay() !== 0 && currentDate.getDay() !== 6) &&
      dates.push({
        date: currentDate.getDate(),
        month: currentDate.toLocaleString("en-us", { month: "short" }),
        day: currentDate.toLocaleString("en-us", { weekday: "short" }),
        dateKey: currentDate.toLocaleString("en-us", { day: "2-digit", month: "short", year: "2-digit" }),
      });
    start = new Date(start).setDate(new Date(start).getDate() + 1);
  }
  return dates;
};

export function DataTable<TData, TValue>({ tableData }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [startDate, setStartDate] = React.useState<any>();
  const [weekend, setWeekend] = React.useState<boolean>(false);
  const [billable, setBillable] = React.useState<string>("totalTime");
  const [sortingType,setSortingType] = React.useState<number>(0);
  const [data,setData] = React.useState<TData[]>(tableData);

  //function to create dynamic columns based on dates
  const getDynamicColumns = () => {
    const days = weekend ? 6 : 8;
    const endDate = new Date(new Date(startDate).getTime() + 86400000 * days);
    return getDatesInRange(Date.parse(startDate), endDate, weekend).map((dateObj) => {
      return {
        accessorKey: `timeAssigned.${dateObj.dateKey}.${billable}`,
        header: ({}) => {
          return (
            <ColumnPopover setSortingType={setSortingType} sortingType={sortingType} id={dateObj.dateKey}>
              <p className="flex flex-col items-center justify-center">
                <span>{`${dateObj.date} ${dateObj.month}`}</span>
                <span>{dateObj.day}</span>
              </p>
            </ColumnPopover>
          );
        },
      };
    });
  };


  //function to sort rows
  const getSortedRows = ()=> {
    const sortedData = data.map((item:any)=>{
      console.log(item)
    })
    return data
  }

  //shadcn modified colums array to create columns
  const columns: ColumnDef<Assignment>[] | any = [
    {
      accessorKey: "name",
      header: ({ column }: any) => {
        return (
          <ColumnPopover  setSortingType={setSortingType} sortingType={sortingType} id="name">
            <span>Name</span>
          </ColumnPopover>
        );
      },
    },
    ...getDynamicColumns(),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const [activeRows, setActiveRows] = React.useState([]);

  const isVisible = (rowObj: any) =>
    activeRows?.find((item) => item === rowObj.original.userName) || !rowObj.original.userName;

  const clickHandler = (rowObj: any) =>
    !rowObj?.original?.userName &&
    setActiveRows((prev: any) =>
      prev?.find((item: string) => rowObj?.original?.title === item)
        ? prev?.filter((item: string) => item !== rowObj?.original?.title)
        : [...prev, rowObj?.original?.title]
    );

  React.useEffect(() => {
    setStartDate(new Date());
  }, []);

  React.useEffect(()=>{
   setData(getSortedRows());
  },[sortingType]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
        <div className="flex items-center gap-x-1 text-sm">
          <label>Start Date</label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
        {/* weekend dropdown */}
        <Select onValueChange={(value) => setWeekend(value === "weekend" ? true : false)}>
          <SelectTrigger className="w-[220px] 2xl:text-sm">
            <SelectValue placeholder="Weekend/Weekdays" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="p-[5px]">
              <SelectItem value="weekend">
                <SelectItemText value="weekend">weekend</SelectItemText>
              </SelectItem>
              <SelectItem value="weekdays">
                <SelectItemText value="">weekdays</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* time entry type dropdown */}
        <Select onValueChange={(value) => setBillable(value)}>
          <SelectTrigger className="w-[220px] 2xl:text-sm">
            <SelectValue placeholder="Entered time type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="p-[5px]">
              <SelectItem value="billableTime">
                <SelectItemText value="billableTime">Billable</SelectItemText>
              </SelectItem>
              <SelectItem value="nonBillableTime">
                <SelectItemText value="">Non-billable</SelectItemText>
              </SelectItem>
              <SelectItem value="totalTime">
                <SelectItemText value="">Total Time</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex">
              {headerGroup.headers.map((header, i) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`inline-flex shrink-0 grow-0 items-center justify-center  font-normal ${
                      i > 0 ? "basis-[12%] px-0" : "basis-[15%] px-0"
                    }`}
                  >
                    <span className="flex">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(
              (row: any) =>
                isVisible(row) && (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => row.original.isProjectAssigned && clickHandler(row)}
                    className={`flex ${
                      !row.original.userName ? "cursor-pointer" : "transition-all duration-300 ease-in-out"
                    }`}
                  >
                    {row.getVisibleCells().map((cell: any, i: number) => (
                      <TableCell
                        className={`inline-block h-[43px] max-h-[43px] shrink-0 grow-0 basis-[15%]
                        px-0 py-0 tabular-nums ${
                          i < 1
                            ? row.original.userName
                              ? "relative inline-flex items-center before:absolute before:-top-6 before:left-8 before:block before:h-[46px] before:w-4 before:rounded-bl-md before:border-b-2 before:border-l-2 before:border-slate-300 before:-indent-[9999px] before:content-['a']"
                              : "inline-flex items-center"
                            : "basis-[12%]"
                        }`}
                        key={cell.id}
                      >
                        {i < 1 && !cell.row.original.userName && (
                          <>
                            {activeRows.find((item) => item === cell.row.original?.name) ? (
                              <ChevronDown className={`ml-2 block h-4 w-4 shrink-0 stroke-slate-500`} />
                            ) : (
                              <ChevronRight
                                className={`ml-2 block h-4 w-4 shrink-0 ${
                                  row.original.isProjectAssigned ? "stroke-slate-500 " : "stroke-muted"
                                }`}
                              />
                            )}
                            <UserAvatar
                              user={{ name: cell.row.original.name, image: cell.row.original.userAvatar }}
                              className="z-10 mr-2 inline-block h-5 w-5"
                            />
                          </>
                        )}
                        <span
                          className={
                            i < 1
                              ? `line-clamp-1 h-[15px] cursor-default ${
                                  row.original.userName ? "relative left-14" : ""
                                }`
                              : "flex h-full items-center justify-center"
                          }
                          title={cell.row.original.title}
                        >
                          {i > 0 && !cell.row.original.timeAssigned[columns[i].accessorKey.split(".")[1]]
                            ? 0
                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}

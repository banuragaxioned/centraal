import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addYears, format } from "date-fns";
import { Calendar as CalendarIcon, Infinity } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UseFormSetValue } from "react-hook-form";
import { AssignFormValues } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { GetSetDateProps } from "@/types";

interface DatePickerProps extends GetSetDateProps {
  children?: React.ReactNode;
}

export const DatePicker = ({ date, setDate }: GetSetDateProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export const ClassicDatePicker = ({ date, setDate, children }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const todaysDate = new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1.5">
          <CalendarIcon size={16} />
          {!children && <span className="text-sm">Pick a date</span>}
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto p-0">
        <Calendar
          mode="single"
          initialFocus
          selected={date}
          defaultMonth={date}
          toDate={todaysDate}
          onSelect={(select) => {
            if (select) {
              setDate(select);
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export function CalendarDateRangePicker({
  setVal,
  isOngoing,
  setOngoing,
  startDate,
  enddate
}: {
  setVal: UseFormSetValue<AssignFormValues> | any;
  isOngoing?: boolean;
  startDate?: any;
  enddate?: any;
  setOngoing: Dispatch<SetStateAction<boolean>>;
}) {
  const [date, setDate] = useState<DateRange | any>({
    from: startDate ? new Date(startDate) : new Date(),
    to: enddate ? new Date(enddate) : new Date(),
  });

  useEffect(() => {
      if (date?.from) {
        setVal("date", date?.from);
        setVal("enddate", date?.from);
      }
      if (date?.to) setVal("enddate", date?.to);
  
  }, [date]);

  const handleChecked = (evt: boolean) => {
    evt
      ? setDate((prev: DateRange | undefined) => prev?.from && { from: prev?.from, to: addYears(prev?.from, 1) })
      : setDate((prev: DateRange | undefined) => ({ from: prev?.from, to: undefined }));
    setOngoing(evt);
  };

  return (
    <div className={cn("mt-2 grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {startDate ? format(date.from, "LLL dd") : format(date.from, "LLL dd, y")} -{" "}
                  {isOngoing ? (
                    <Infinity className="ml-1 stroke-[1.5]" />
                  ) : startDate ? (
                    format(date.to, "LLL dd")
                  ) : (
                    format(date.to, "LLL dd, y")
                  )}
                </>
              ) : startDate ? (
                format(date.from, "LLL dd")
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            today={date?.to}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
          {(isOngoing || (date?.from && !date?.to)) && (
            <div className="items-top flex justify-end space-x-2 p-3">
              <Checkbox id="terms1" checked={isOngoing} onCheckedChange={handleChecked} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set as Ongoing
                </label>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

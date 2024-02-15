"use client";

import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { toast } from "sonner";

import { useTimeEntryState } from "@/store/useTimeEntryStore";

import { TimeEntryDataObj } from "@/types";
import { Project } from "@/types";
import { TimeEntriesList } from "./time-entries-list";
import { InlineDatePicker } from "./inline-date-picker";

import { SelectedData } from "./forms/timelogForm";
import { Card } from "./ui/card";
import { TimeLogForm } from "./forms/timelogForm";
import { useRouter } from "next/navigation";
import { format, startOfToday } from "date-fns";

interface TimeEntryProps {
  team: string;
  projects: Project[];
}

export interface EditReferenceObj {
  obj: SelectedData;
  isEditing: boolean;
  id: number | null;
}

export type EntryData = {
  data: TimeEntryDataObj;
  status: string;
};

/*
 * getDateString: returns date in format Wed, Jan 31
 */
export const getDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", { day: "2-digit", month: "short", weekday: "short", year: "numeric" });
};

export const TimeEntry = ({ team, projects }: TimeEntryProps) => {
  const router = useRouter();
  const updateTime = useTimeEntryState((state) => state.updateTime);
  const setQuickActionDate = useTimeEntryState((state) => state.setQuickActionDate);
  const resetTimeEntryStates = useTimeEntryState((state) => state.resetTimeEntryStates);
  const [date, setDate] = useState<Date>(startOfToday());
  const [edit, setEdit] = useState<EditReferenceObj>({ obj: {}, isEditing: false, id: null });
  const [entries, setEntries] = useState<EntryData>({ data: {}, status: "loading" });

  // This sets the date to the store which we can utilize for quick action time
  useEffect(() => {
    setQuickActionDate(date);

    return () => {
      resetTimeEntryStates();
    };
  }, [date, setQuickActionDate, resetTimeEntryStates]);

  const editEntryHandler = (obj: SelectedData, id: number) => {
    const currentlyEditing = edit.id;
    if (currentlyEditing === id) {
      setEdit({ obj: {}, isEditing: false, id: null });
    } else {
      setEdit({ obj, isEditing: true, id });
    }
  };

  const hoursToDecimal = (val: string) => Number(val.replace(":", "."));

  /*
   * getTimeEntries: The following function will return the time entries of the specified dates
   */
  const getTimeEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&date=${getDateString(date)}`);
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setEntries((prevEntries) => ({ data: { ...prevEntries.data, ...data }, status: "success" }));
      } else {
        setEntries({ data: {}, status: "success" });
      }
    } catch (error) {
      console.error("Error fetching time entries", error);
      setEntries({ data: {}, status: "error" });
    }
  }, [team, date]);

  /*
   * deleteTimeEntry: The following function will return the time entry of the specified id
   */
  const deleteTimeEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/team/time-entry?team=${team}&id=${JSON.stringify(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete. Server responded with ${response.status}`);

      getTimeEntries();
      router.refresh();
      toast("Time entry deleted!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error deleting time entry", error);
    }
  };

  /*
   * submitTimeEntry: The following function will return the time entry of the specified id
   */
  const submitTimeEntry = async (e: FormEvent, clearForm: Function, selectedData: SelectedData = {}) => {
    e.preventDefault();
    if (!selectedData) return;
    const { project, milestone, time, comment, billable, task } = selectedData || {};
    const dateToStoreInDB = format(date, "yyyy-MM-dd"); // Extracts only the date

    const dataToSend = {
      team,
      project: project?.id,
      milestone: milestone?.id,
      time: Number(hoursToDecimal(time ?? "0")) * 60,
      comments: comment?.trim(),
      billable: billable ? true : false,
      task: task?.id,
      date: dateToStoreInDB,
    };

    try {
      const response = await fetch("/api/team/time-entry", {
        method: `${edit.isEditing ? "PUT" : "POST"}`,
        body: JSON.stringify(edit.isEditing ? { ...dataToSend, id: edit.id } : dataToSend),
      });
      if (response.ok) {
        toast.success(`${edit.isEditing ? "Updated" : "Added"} time entry in ${project?.name}`);
        edit.isEditing ? setEdit({ obj: {}, isEditing: false, id: null }) : null;
        getTimeEntries();
        clearForm();
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("Error submitting form!", error);
    }
  };

  useEffect(() => {
    getTimeEntries();
  }, [getTimeEntries, updateTime]);

  const dayTotalTime = useMemo(() => entries.data.dayTotal, [entries.data]);

  return (
    <div className="w-full">
      <Card className="shadow-none">
        <div className="flex justify-between gap-2 border-b p-2">
          <InlineDatePicker date={date} setDate={setDate} dayTotalTime={dayTotalTime} />
        </div>
        <TimeLogForm projects={projects} edit={edit} submitHandler={submitTimeEntry} />
        {dayTotalTime && (
          <p className="mb-2 flex justify-between px-5 font-medium">
            Total time logged for the day
            <span className="normal-nums">{dayTotalTime.toFixed(2)} h</span>
          </p>
        )}
        <TimeEntriesList
          entries={entries.data}
          status={entries.status}
          deleteEntryHandler={deleteTimeEntry}
          editEntryHandler={editEntryHandler}
          edit={edit}
        />
      </Card>
    </div>
  );
};

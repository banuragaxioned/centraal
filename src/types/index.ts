import { Dispatch } from "react";
import { Icons } from "@/components/icons";
import { Tenant, Role, AllocationFrequency, Status } from "@prisma/client";
import { ColumnDef, Table } from "@tanstack/react-table";

export type UserProfile = {
  name: string | null;
  id: number;
  image: string;
};

export type NavLink = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarTeam: SidebarNavItem[];
  sidebarProjects: SidebarNavItem[];
  sidebarSkills: SidebarNavItem[];
  sidebarReports: SidebarNavItem[];
  sidebarProfile: SidebarNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<Tenant, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
  };

export type AllocationDates = {
  [date: string]: {
    id: number;
    billableTime: number;
    nonBillableTime: number;
    totalTime: number;
    updatedAt: Date;
    frequency?: string;
  };
};

export type ProjectAllocation = {
  globalView: boolean;
  clientName: string;
  projectId: number;
  projectName: string;
  users: {
    userId: number;
    userName: string | null;
    userAvatar: string;
    averageTime: number;
    allEntries: number;
    allocations: AllocationDates;
  }[];
};

export type Summary = {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
  billable: boolean;
  projectOwner: string | null;
  projectOwnerAvatar: string | null;
  budget: number;
  logged: number;
};

export type SkillScore = {
  id: number;
  name: string;
  value: number;
};

export type SkillRadar = SkillScore[];

export type ProjectInterval = {};

export type ComboboxOptions = {
  id: number;
  name?: string | null;
};

export type AllProjectsWithMembers = {
  id: number;
  name?: string | null;
  Members: ComboboxOptions[];
};

export type AssignFormValues = {
  date: Date;
  billableTime: number;
  nonBillableTime: number;
  projectId: number;
  userId: number;
  frequency: AllocationFrequency;
  enddate?: Date;
};

export type AllUsersWithAllocation = {
  id: number;
  name?: string | null;
  Allocation: { id: number; projectId: number }[];
};

export interface UserGroup {
  id: number;
  name: string;
}

export type Members = {
  id: number;
  name?: string;
  email: string;
  image?: string;
  status: Status;
  role: Role;
  userGroup: UserGroup[];
  projectId: number;
};

export type pageProps = { params: { team: Tenant["slug"] } };

export type projectProps = { params: { project: Tenant["slug"]; team: Tenant["slug"] } };

export interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export interface AllocationDetails {
  billable: boolean;
  clientName: string;
  id: number;
  name: string;
  team: string;
  timeAssigned: AllocationDates[];
  title: string;
  userId: number;
  userName: string;
}

export interface Assignment {
  name: string;
  image: string | null;
  userId: number;
  userName: string;
  title: string;
  subRows: AllocationDetails[] | undefined;
  skills?: Skills[];
}

interface Skills {
  level: number;
  skill: string;
}

export type Client = {
  id: number;
  name: string;
  status: Status;
  Project: number;
};

export interface Project {
  billable?: boolean;
  id: number;
  name: string;
  milestone?: Milestone[];
  task?:Milestone[];
  client?:Milestone;
}

type TimeEntryProperties = {
  id:number,
  milestone:Milestone;
  task:Milestone|null;
  comments: string | null;
  billable:boolean;
  time:number;
}

interface ProjectLog {
  project:Project;
  total:number;
  data:TimeEntryProperties[];
}

export interface TimeEntryData {
  projectsLog:ProjectLog[];
  dayTotal:number;
}

export interface TimeEntryDataObj {
  [key:string]:TimeEntryData
}

 export type Milestone = {
  id: number;
  name: string;
  billable?:boolean;
};

export interface GetSetDateProps {
  date:Date;
  setDate:Dispatch<Date>|any;
}

import { Icons } from "@/components/icons";
import { Tenant, User, Project, Allocation, Role } from "@prisma/client";

export type Allocations = {
  id: number;
  date: string;
  billable: number;
  nonBillable: number;
  total: number;
};

export type Projects = {
  id: number;
  name: string;
  total: number;
  average: number;
  dates: Allocations[];
};

export type UserProfile = {
  name: string | null;
  id: number;
  image: string;
};

export type AllocationReport = {
  User: UserProfile & {
    Projects: Projects[];
    totalHours: number;
    averageHours: number;
  };
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
    totalTime: number;
    allocations: AllocationDates;
  }[];
};

export type GlobalAllocation = {
  globalView: boolean;
  userId: number;
  userName: string | null;
  userAvatar: string;
  totalTime: number;
  averageTime: number;
  cumulativeProjectDates: AllocationDates;
  projects: {
    clientName: string;
    projectId: number;
    projectName: string;
    totalTime: number;
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

export type Assignment = {
  id: number;
  date: Date;
  endate?: Date | null;
  billableTime?: number;
  nonBillableTime?: number;
  projectId: number;
  projectName: string;
  userId: number;
  userName?: string | null;
  userImage?: string | null;
  frequency: string;
  status: string;
};

export type getAllocation = {
  team: string;
  startDate: Date;
  endDate: Date;
  page: number;
  pageSize: number;
  projectId?: number;
};

export type SkillScore = {
  id: number;
  name: string;
  level: number;
};

export type SkillRadar = SkillScore[];

export type ProjectInterval = {};

export type ComboboxOptions = {
  id: number;
  name: string | null | undefined;
};

export type AllProjectsWithMembers = {
  id: number;
  name: string | null | undefined;
  Members: ComboboxOptions[];
};

export type AssignFormValues = {
  date: Date;
  billableTime: number;
  nonBillableTime: number;
  projectId: number;
  userId: number;
  frequency: "DAY" | "ONGOING";
  enddate?: Date | undefined;
};

export type AllUsersWithAllocation = {
  id: number;
  name: string | null | undefined;
  Allocation: { id: number; projectId: number }[];
};

export type Member = {
  id: number;
  name: string;
  mail: string;
  userId: number;
  avatar: string | null;
  role: string;
};

export type allMembers = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  allocationId: number | null;
  TenantId: { slug: string; }[];
  Roles: { tenantId: number; id: number; role: Role; Tenant: { slug: string } }[];
};

import { notFound } from "next/navigation";
import { getProjectSummary, getAllUserProjects } from "@/server/services/project";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeEntry } from "@/components/time-entry";
import { getCurrentUser } from "@/lib/session";
import { pageProps } from "@/types";
import { db } from "@/lib/db";
import {
  Card,
  Text,
  Flex,
  CategoryBar,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  ProgressBar,
} from "@tremor/react";
import { Icons } from "@/components/icons";
import { MarkerBar } from "@/components/marker-bar";
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function Dashboard({ params }: pageProps) {
  const user = await getCurrentUser();
  const { team } = params;

  if (!user) {
    return notFound();
  }

  const userTimeAllocated = await db.allocation.findMany({
    where: {
      userId: user.id,
    },
    select: {
      billableTime: true,
      nonBillableTime: true,
      Project: {
        select: {
          id: true,
          name: true,
        }
      },
      User: {
        select: {
          TimeEntry: {
            select: {
              projectId: true,
              time: true,
            }
          }
        }
      }
    }
  })
  const projects = await getAllUserProjects(user.id);

  const userTimeEntry = await db.timeEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      time: true,
      Project: {
        select: {
          name: true,
        }
      },
    }
  })

  const overallEntryTime = userTimeEntry.map((item) => item.time).reduce((sum: number, num: number) => sum + num, 0);

  return (
    <div className="col-span-12 grid w-full grid-cols-12">
      <main className="col-span-12 flex flex-col gap-4 md:col-span-9">
        {/* Horizontal Calendar and date picker */}
        <TimeEntry team={team} projects={projects ? projects : []} />
      </main>
      <aside className="col-span-12 hidden space-y-12 md:col-span-3 lg:block lg:basis-1/4">
        {/* Quick stats (% of time logged in the last week) */}
        <div className="flex flex-col items-center gap-4">
          <Card className="mx-auto w-[95%] p-4 pb-6 side-bar">
            <Flex className="font-semibold items-center">
              <Text className="pb-5 text-base bg-gradient-to-r from-green-to-red">Logged hours</Text>
              <Text className="text-[#6B7280] text-xs flex items-center pb-5">
                <Icons.calendar className="ml-2 h-4 w-4 mr-[5px]" />
                Current week
              </Text>
            </Flex>
            <Flex>
              <Text className="pb-4 text-sm">
                <span className="text-3xl font-semibold">{overallEntryTime}</span> / 40h
              </Text>
            </Flex>
            <CategoryBar
              values={[25, 25, 25, 25]}
              colors={["rose", "orange", "yellow", "emerald"]}
              markerValue={(overallEntryTime / 40) * 100}
              className="mt-3 text-sm "
              tooltip={`${Math.round((overallEntryTime / 40) * 100)}%`}
            />
            {/* Time Insights (breakdown of time based on projects) */}
            <Text className="pb-5 pt-8 text-base font-semibold">Time logged</Text>
            <TabGroup>
              <TabList className="">
                <Tab>Projects</Tab>
                <Tab>Assigned</Tab>
              </TabList>
              <TabPanels>
                <TabPanel className="max-h-[500px] mt-0">
                  <ScrollArea className={` ${userTimeEntry.length > 5 ? "h-[500px]" : "h-auto"} w-full}`}>
                    {userTimeEntry.map((item, i) => (
                      <div className="mt-8 pr-3" key={i}>
                        <Text className="w-full font-semibold text-black leading-5">{item.Project.name}</Text>
                        <Flex className="items-center mt-3">
                          <ProgressBar value={userTimeEntry.length === 0 ? 0 : item.time} color="indigo" className="mr-4" />
                          <Text className="text-gray-500 text-sm font-normal">{Math.round(item.time / 40 * 100)}%</Text>
                        </Flex>
                      </div>
                    ))}
                  </ScrollArea>
                </TabPanel>
                <TabPanel>
                  {userTimeAllocated.map((item, i) => {
                    const entryValue = item.User.TimeEntry.filter((ele) => ele.projectId === item.Project.id).reduce((acc, current) => acc + current.time, 0);
                    return (
                      <div className="mt-8" key={i}>
                        <Text className="w-full font-semibold text-black leading-5">{item.Project.name}</Text>
                        <Flex className="items-center mt-3">
                          <MarkerBar value={item.billableTime + item.nonBillableTime} minValue={0} maxValue={entryValue} color="slate" className="mr-4 relative w-full bg-slate-200 rounded-md" />
                          <Text className="text-gray-500 text-sm font-normal">{entryValue}h</Text>
                        </Flex>
                      </div>
                    )
                  })}
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        </div>
        {/* Time Insights (breakdown of time over the last week)
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div> */}
      </aside>
    </div>
  );
}

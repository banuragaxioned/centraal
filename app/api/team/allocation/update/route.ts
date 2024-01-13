import { getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

const allocationCreateSchema = z.object({
  billable: z.coerce.number().optional(),
  nonBillable: z.coerce.number().optional(),
  total: z.coerce.number().optional(),
  onGoing: z.coerce.boolean(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  projectId: z.coerce.number().min(1),
  userId: z.coerce.number().min(1),
  team: z.string().min(1),
});

const updatedAllocation = async (requiredAllocation: any, data: any, range: any) => {
  const { billable, nonBillable } = data;
  const { from, to, onGoing } = range;

  return await db.allocation.update({
    where: {
      id: requiredAllocation?.id,
    },
    data: {
      billableTime: billable,
      nonBillableTime: nonBillable,
      frequency: onGoing ? "ONGOING" : "DAY",
      date: from,
      enddate: onGoing ? null : to,
      updatedAt: new Date(),
    },
  });
};

const insertAllocation = async (data: any, range: any, userId: number, projectId: number, team: string) => {
  const { billable, nonBillable } = data;
  const { from, to, onGoing } = range;

  return await db.allocation.create({
    data: {
      billableTime: billable,
      nonBillableTime: nonBillable,
      frequency: onGoing ? "ONGOING" : "DAY",
      date: from,
      enddate: onGoing ? null : to,
      workspace: {
        connect: { slug: team },
      },
      project: {
        connect: { id: projectId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const json = await req.json();
    const body = allocationCreateSchema.parse(json);

    // check if the user has permission to the current team/workspace id if not return 403
    // user session has an object (name, id, slug, etc) of all workspaces the user has access to. i want to match slug.
    if (user.workspaces.filter((workspace) => workspace.slug === body.team).length === 0) {
      return new Response("Unauthorized", { status: 403 });
    }

    const getAllocationData = await db.allocation.findMany({
      select: {
        id: true,
        userId: true,
        project: true,
        projectId: true,
        frequency: true,
        date: true,
        enddate: true,
      },
    });

    const data = {
      total: body.total,
      billable: body.billable,
      nonBillable: body.nonBillable,
    };

    const range = {
      from: body.startDate,
      to: body.endDate,
      onGoing: body.onGoing,
    };

    const requiredAllocation = getAllocationData.find(
      (obj) =>
        (obj.projectId === body.projectId &&
          obj.userId === body.userId &&
          new Date(obj.date).toLocaleDateString("en", { day: "2-digit", month: "2-digit", year: "2-digit" }) ===
            new Date(body.startDate).toLocaleDateString("en", { day: "2-digit", month: "2-digit", year: "2-digit" }) &&
          new Date(obj.enddate ? obj.enddate : "").toLocaleDateString("en", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }) ===
            new Date(body.endDate ? body.endDate : "").toLocaleDateString("en", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })) ||
        obj.frequency === "ONGOING",
    );
    const response = requiredAllocation?.id
      ? await updatedAllocation(requiredAllocation, data, range)
      : await insertAllocation(data, range, body.userId, body.projectId, body.team);
    return new Response(JSON.stringify({ response }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

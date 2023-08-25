import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;

    const data = await db.tenant.findUnique({
      where: { slug: "axioned" },
      select: {
        Users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            Roles: {
              select: {
                role: true,
              },
              where: {
                role: {
                  not: undefined,
                },
              },
            },
            UsersStatus: {
              select: {
                status: true
              }
            }
          },
        },
      },
    });

    const memberList = data?.Users.map((member) => {
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        image: member.image,
        status: member.UsersStatus,
        role: member.Roles.map((userRole) => userRole.role)[0],
      };
    });

    return new Response(JSON.stringify(memberList));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
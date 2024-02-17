import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  const email = params.email;
  try {
    const posts = await prisma.user.findUnique({
      where: { email },
      include: {
        posts: { orderBy: { createdAt: "desc" } },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: "post not fetching" });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "post not fetching" });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ Error: "Not authenticated" }, { status: 401 });
  }
  const { title, content, links, selectedCategory, imageUrl, publicId } =
    await req.json();
  const id = params.id;

  try {
    const updatePost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        links,
        catName: selectedCategory,
        imageUrl,
        publicId,
      },
    });
    return NextResponse.json(updatePost);
  } catch (error) {
    return NextResponse.json({ message: "error editing post" });
  }
}

export async function DELETE(
  req: Response,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ Error: "Not authenticated" }, { status: 401 });
  }
  const id = params.id;
  try {
    const post = await prisma.post.delete({ where: { id } });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "error deleting the post" });
  }
}

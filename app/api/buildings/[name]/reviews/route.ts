import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name: nameParam } = await params;
    const name = decodeURIComponent(nameParam);

    const reviews = await prisma.review.findMany({
      where: {
        building: {
          equals: name,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            username: true,
            class: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}


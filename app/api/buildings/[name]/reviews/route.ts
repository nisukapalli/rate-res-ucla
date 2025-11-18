import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name: nameParam } = await params;
    const name = decodeURIComponent(nameParam);

    // Check if user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    let userId: number | null = null;

    if (token) {
      try {
        const decoded = verify(token.value, process.env.JWT_SECRET!) as { userId: number };
        userId = decoded.userId;
      } catch {
        // Invalid token, continue as guest
      }
    }

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
        votes: userId ? {
          where: {
            userId,
          },
          select: {
            voteType: true,
          },
        } : false,
      },
    });

    // Transform the response to include userVote field
    const reviewsWithUserVote = reviews.map(review => ({
      ...review,
      userVote: Array.isArray(review.votes) && review.votes.length > 0 
        ? review.votes[0].voteType.toLowerCase() 
        : null,
      votes: undefined, // Remove the votes array from response
    }));

    return NextResponse.json(reviewsWithUserVote);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}


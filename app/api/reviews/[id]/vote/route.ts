import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in to vote" },
        { status: 401 }
      );
    }

    const decoded = verify(token.value, process.env.JWT_SECRET!) as { userId: number };
    const userId = decoded.userId;

    const { id } = await params;
    const reviewId = parseInt(id);
    const { voteType } = await request.json();

    if (!["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type" },
        { status: 400 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.userVote.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    const newVoteType = voteType === "upvote" ? "UPVOTE" : "DOWNVOTE";

    if (existingVote) {
      // User is changing their vote
      if (existingVote.voteType !== newVoteType) {
        // Update the vote
        await prisma.userVote.update({
          where: { id: existingVote.id },
          data: { voteType: newVoteType },
        });

        // Adjust counts
        if (newVoteType === "UPVOTE") {
          await prisma.review.update({
            where: { id: reviewId },
            data: {
              upvotes: review.upvotes + 1,
              downvotes: review.downvotes - 1,
            },
          });
        } else {
          await prisma.review.update({
            where: { id: reviewId },
            data: {
              upvotes: review.upvotes - 1,
              downvotes: review.downvotes + 1,
            },
          });
        }
      }
      // If same vote, do nothing (user already voted this way)
    } else {
      // Create new vote
      await prisma.userVote.create({
        data: {
          userId,
          reviewId,
          voteType: newVoteType,
        },
      });

      // Update counts
      await prisma.review.update({
        where: { id: reviewId },
        data: {
          upvotes: newVoteType === "UPVOTE" ? review.upvotes + 1 : review.upvotes,
          downvotes: newVoteType === "DOWNVOTE" ? review.downvotes + 1 : review.downvotes,
        },
      });
    }

    // Get updated review
    const updatedReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        upvotes: true,
        downvotes: true,
      },
    });

    return NextResponse.json({
      upvotes: updatedReview!.upvotes,
      downvotes: updatedReview!.downvotes,
      userVote: newVoteType.toLowerCase(),
    });
  } catch (error) {
    console.error("Error voting on review:", error);
    return NextResponse.json(
      { error: "Failed to vote on review" },
      { status: 500 }
    );
  }
}


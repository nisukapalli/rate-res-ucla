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
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in to vote" },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const decoded = verify(token.value, process.env.JWT_SECRET!) as { userId: number };
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }

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
      if (existingVote.voteType === newVoteType) {
        // User is removing their vote
        await prisma.userVote.delete({
          where: { id: existingVote.id },
        });

        // Decrement the count
        if (newVoteType === "UPVOTE") {
          await prisma.review.update({
            where: { id: reviewId },
            data: {
              upvotes: review.upvotes - 1,
            },
          });
        } else {
          await prisma.review.update({
            where: { id: reviewId },
            data: {
              downvotes: review.downvotes - 1,
            },
          });
        }
      } else {
        // User is changing their vote
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

    // Check if vote was removed
    const finalVote = await prisma.userVote.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    return NextResponse.json({
      upvotes: updatedReview!.upvotes,
      downvotes: updatedReview!.downvotes,
      userVote: finalVote ? finalVote.voteType.toLowerCase() : null,
    });
  } catch (error) {
    console.error("Error voting on review:", error);
    return NextResponse.json(
      { error: "Failed to vote on review" },
      { status: 500 }
    );
  }
}


import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      building,
      overall,
      location,
      distance,
      social,
      noise,
      clean,
      text,
      authorId,
    } = body;

    if (
      !building ||
      overall === undefined ||
      location === undefined ||
      distance === undefined ||
      social === undefined ||
      noise === undefined ||
      clean === undefined ||
      !authorId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: building, overall, location, distance, social, noise, clean, authorId",
        },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        building,
        overall,
        location,
        distance,
        social,
        noise,
        clean,
        text: text || null,
        authorId,
      },
    });

    return NextResponse.json(review, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: `Failed to create review: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}


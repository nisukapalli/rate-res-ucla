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
      yearStart,
      yearEnd,
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
      yearStart === undefined ||
      yearEnd === undefined ||
      !authorId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: building, overall, location, distance, social, noise, clean, yearStart, yearEnd, authorId",
        },
        { status: 400 }
      );
    }

    // Validate year fields
    const currentYear = new Date().getFullYear();
    
    if (yearStart < 1919 || yearStart > currentYear) {
      return NextResponse.json(
        { error: `Start year must be between 1919 and ${currentYear}` },
        { status: 400 }
      );
    }

    if (yearEnd < 1919 || yearEnd > currentYear + 1) {
      return NextResponse.json(
        { error: `End year must be between 1919 and ${currentYear + 1}` },
        { status: 400 }
      );
    }

    if (yearStart > yearEnd) {
      return NextResponse.json(
        { error: "Start year cannot be after end year" },
        { status: 400 }
      );
    }

    if (yearEnd - yearStart > 4) {
      return NextResponse.json(
        { error: "You cannot have lived in a building for more than 4 years" },
        { status: 400 }
      );
    }

    // Check if user already has a review for this building
    const existingReview = await prisma.review.findFirst({
      where: {
        building: building,
        authorId: authorId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error: "You have already submitted a review for this building. Each user can only submit one review per building.",
        },
        { status: 409 } // 409 Conflict
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
        yearStart,
        yearEnd,
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


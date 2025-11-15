import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      building,
      overall,
      location,
      distance,
      social,
      noise,
      clean,
      value,
      text,
    } = body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(building !== undefined && { building }),
        ...(overall !== undefined && { overall }),
        ...(location !== undefined && { location }),
        ...(distance !== undefined && { distance }),
        ...(social !== undefined && { social }),
        ...(noise !== undefined && { noise }),
        ...(clean !== undefined && { clean }),
        ...(value !== undefined && { value }),
        ...(text !== undefined && { text: text || null }),
      },
    });

    return NextResponse.json(review);

  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
    
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}


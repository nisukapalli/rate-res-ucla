import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(buildings);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch buildings" },
      { status: 500 }
    );
  }
}

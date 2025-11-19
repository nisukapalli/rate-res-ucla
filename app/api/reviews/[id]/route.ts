import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const reviewId = parseInt(idParam);

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { userId: number };

    // Check if review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.authorId !== decoded.userId) {
      return NextResponse.json({ error: 'Not authorized to delete this review' }, { status: 403 });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const reviewId = parseInt(idParam);

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { userId: number };

    // Check if review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.authorId !== decoded.userId) {
      return NextResponse.json({ error: 'Not authorized to update this review' }, { status: 403 });
    }

    const body = await request.json();
    const { overall, location, distance, social, noise, clean, text, yearStart, yearEnd } = body;

    // Validate year fields if provided
    if (yearStart !== undefined && yearEnd !== undefined) {
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
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        overall,
        location,
        distance,
        social,
        noise,
        clean,
        text: text || null,
        ...(yearStart !== undefined && { yearStart }),
        ...(yearEnd !== undefined && { yearEnd }),
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

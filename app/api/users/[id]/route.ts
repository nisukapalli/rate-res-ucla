import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).optional(),
  class: z.number().int().min(1919).max(new Date().getFullYear() + 6).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const targetUserId = parseInt(idParam);

    if (isNaN(targetUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { userId: number };

    // Verify user is updating their own profile
    if (decoded.userId !== targetUserId) {
      return NextResponse.json({ error: 'Not authorized to update this user' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If changing password, verify current password
    if (validatedData.newPassword) {
      if (!validatedData.currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      const isValidPassword = await compare(validatedData.currentPassword, currentUser.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
    }

    // Check if username is taken (if changing username)
    if (validatedData.username && validatedData.username !== currentUser.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Check if email is taken (if changing email)
    if (validatedData.email && validatedData.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (validatedData.username) updateData.username = validatedData.username;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.class) updateData.class = validatedData.class;
    if (validatedData.newPassword) {
      updateData.password = await hash(validatedData.newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        class: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}


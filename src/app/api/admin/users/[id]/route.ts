import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// Update user role (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { role } = await req.json();
    const { id } = await params;

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be USER or ADMIN' }, { status: 400 });
    }

    // Prevent admin from demoting themselves
    if (id === payload.id && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Update User Role Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

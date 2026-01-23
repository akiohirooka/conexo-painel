import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


export async function getUserFromClerkId(clerkId: string) {
  let user = await db.users.findUnique({
    where: { clerk_user_id: clerkId }
  });

  if (!user) {
    // Create user if doesn't exist (with placeholder email since it's required)
    user = await db.users.create({
      data: {
        clerk_user_id: clerkId,
        email: `${clerkId}@placeholder.local`
      }
    });
  }

  return user;
}

export function createAuthErrorResponse(message: string, status: number = 401) {
  return NextResponse.json(
    { error: message, success: false },
    { status }
  );
}

export async function validateUserAuthentication() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
}

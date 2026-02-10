import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getClerkUserProfile, getUsersFallbackEmail } from '@/lib/auth/clerk-user-profile';
import { assertAccountIsNotDeleted } from '@/lib/auth/account-status';


export async function getUserFromClerkId(clerkId: string) {
  let user = await db.users.findUnique({
    where: { clerk_user_id: clerkId }
  });

  const shouldRefreshEmail = user
    ? user.email.endsWith('@placeholder.local') || !user.email.includes('@')
    : false;
  if (user && shouldRefreshEmail) {
    const clerkProfile = await getClerkUserProfile(clerkId);
    if (clerkProfile?.email) {
      user = await db.users.update({
        where: { id: user.id },
        data: { email: clerkProfile.email }
      });
    }
  }

  if (!user) {
    const clerkProfile = await getClerkUserProfile(clerkId);

    // Upsert prevents duplicate key errors when webhook and app requests race.
    user = await db.users.upsert({
      where: { clerk_user_id: clerkId },
      update: {},
      create: {
        clerk_user_id: clerkId,
        email: clerkProfile?.email ?? getUsersFallbackEmail(),
        first_name: clerkProfile?.firstName ?? null,
        last_name: clerkProfile?.lastName ?? null,
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

  await assertAccountIsNotDeleted(userId);

  return userId;
}

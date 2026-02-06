import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { db } from '@/lib/db';

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.users.findUnique({
    where: { clerk_user_id: userId },
    select: {
      display_name: true,
      whatsapp_phone_e164: true,
      onboarding_completed: true,
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/35 px-4 py-8">
      <OnboardingForm
        initialDisplayName={user?.display_name ?? ''}
        initialWhatsappPhoneE164={user?.whatsapp_phone_e164 ?? ''}
        initialCompleted={Boolean(user?.onboarding_completed)}
      />
    </div>
  );
}

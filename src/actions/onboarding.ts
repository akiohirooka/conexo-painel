'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { db } from '@/lib/db';
import { normalizeJPPhoneToE164 } from '@/lib/onboarding/normalize-jp-phone-to-e164';

const onboardingSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório.')
    .max(120, 'Nome deve ter no máximo 120 caracteres.'),
  phone: z.string().trim().min(1, 'Telefone/WhatsApp é obrigatório.'),
});

type OnboardingFieldErrors = {
  displayName?: string;
  phone?: string;
};

export type CompleteOnboardingResult =
  | {
      success: true;
      data: {
        displayName: string;
        whatsappPhoneE164: string;
      };
    }
  | {
      success: false;
      error: string;
      fieldErrors?: OnboardingFieldErrors;
    };

export async function completeUserOnboarding(input: {
  displayName: string;
  phone: string;
}): Promise<CompleteOnboardingResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, error: 'Não autorizado.' };
  }

  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    return {
      success: false as const,
      error: 'Verifique os campos e tente novamente.',
      fieldErrors: {
        displayName: flattened.displayName?.[0],
        phone: flattened.phone?.[0],
      },
    };
  }

  const normalizedPhone = normalizeJPPhoneToE164(parsed.data.phone);
  if (normalizedPhone.ok === false) {
    return {
      success: false as const,
      error: 'Telefone inválido.',
      fieldErrors: { phone: normalizedPhone.error },
    };
  }

  const now = new Date();

  await db.users.upsert({
    where: { clerk_user_id: userId },
    update: {
      display_name: parsed.data.displayName,
      whatsapp_phone_e164: normalizedPhone.e164,
      onboarding_completed: true,
      updated_at: now,
    },
    create: {
      clerk_user_id: userId,
      email: `${userId}@placeholder.local`,
      display_name: parsed.data.displayName,
      whatsapp_phone_e164: normalizedPhone.e164,
      onboarding_completed: true,
      updated_at: now,
    },
  });

  return {
    success: true as const,
    data: {
      displayName: parsed.data.displayName,
      whatsappPhoneE164: normalizedPhone.e164,
    },
  };
}

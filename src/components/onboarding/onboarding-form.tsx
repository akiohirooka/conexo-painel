'use client';

import Link from 'next/link';
import { type FormEvent, useState, useTransition } from 'react';

import { completeUserOnboarding } from '@/actions/onboarding';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { normalizeJPPhoneToE164 } from '@/lib/onboarding/normalize-jp-phone-to-e164';

const PANEL_HOME_URL = 'https://painel.conexo.jp';

type OnboardingFormProps = {
  initialDisplayName: string;
  initialWhatsappPhoneE164: string;
  initialCompleted: boolean;
};

type FormErrors = {
  displayName?: string;
  phone?: string;
  form?: string;
};

export function OnboardingForm({
  initialDisplayName,
  initialWhatsappPhoneE164,
  initialCompleted,
}: OnboardingFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [phone, setPhone] = useState(initialWhatsappPhoneE164);
  const [completed, setCompleted] = useState(initialCompleted);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  function validateDisplayName(value: string) {
    if (!value.trim()) {
      return 'Nome é obrigatório.';
    }
    return undefined;
  }

  function validatePhone(value: string) {
    const result = normalizeJPPhoneToE164(value);
    if (result.ok === false) {
      return result.error;
    }
    return undefined;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const displayNameError = validateDisplayName(displayName);
    const phoneError = validatePhone(phone);

    if (displayNameError || phoneError) {
      setErrors({
        displayName: displayNameError,
        phone: phoneError,
      });
      return;
    }

    startTransition(async () => {
      const result = await completeUserOnboarding({
        displayName: displayName.trim(),
        phone,
      });

      if (result.success === false) {
        setErrors({
          displayName: result.fieldErrors?.displayName,
          phone: result.fieldErrors?.phone,
          form: result.error,
        });
        return;
      }

      setDisplayName(result.data.displayName);
      setPhone(result.data.whatsappPhoneE164);
      setErrors({});
      setCompleted(true);
    });
  }

  return (
    <Card className="w-full max-w-xl border-border/70">
      <CardHeader>
        <CardTitle className="text-2xl">Bem-vindo(a) à Conexo 👋</CardTitle>
        <CardDescription>Vamos preparar sua conta rapidinho.</CardDescription>
      </CardHeader>

      {!completed ? (
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="displayName"
                name="displayName"
                autoComplete="name"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    displayName: undefined,
                    form: undefined,
                  }));
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    displayName: validateDisplayName(displayName),
                  }))
                }
                aria-invalid={Boolean(errors.displayName)}
              />
              {errors.displayName ? (
                <p className="text-sm text-destructive">{errors.displayName}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone/WhatsApp
              </label>
              <Input
                id="phone"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+819012345678 ou 090-1234-5678"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    phone: undefined,
                    form: undefined,
                  }));
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    phone: validatePhone(phone),
                  }))
                }
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? (
                <p className="text-sm text-destructive">{errors.phone}</p>
              ) : null}
            </div>

            {errors.form ? (
              <p className="text-sm text-destructive">{errors.form}</p>
            ) : null}
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
              loadingText="Salvando..."
            >
              Salvar e continuar
            </Button>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="space-y-6">
          <p className="text-sm text-foreground/90">
            Perfeito! O cadastro do seu negócio é feito dentro do painel.
          </p>

          <Button asChild className="w-full">
            <Link href={PANEL_HOME_URL}>Ir para o painel</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

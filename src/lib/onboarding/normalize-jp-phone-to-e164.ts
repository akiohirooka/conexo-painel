export type NormalizeJPPhoneResult =
  | { ok: true; e164: string }
  | { ok: false; error: string };

const JP_E164_PATTERN = /^\+81\d{9,10}$/;

export function normalizeJPPhoneToE164(input: string): NormalizeJPPhoneResult {
  if (typeof input !== 'string') {
    return { ok: false as const, error: 'Informe um telefone válido.' };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false as const, error: 'Telefone é obrigatório.' };
  }

  if (/[a-z]/i.test(trimmed)) {
    return { ok: false as const, error: 'Telefone não pode conter letras.' };
  }

  const compact = trimmed.replace(/[^\d+]/g, '');
  if (!compact) {
    return { ok: false as const, error: 'Informe um telefone válido.' };
  }

  const plusCount = (compact.match(/\+/g) || []).length;
  if (plusCount > 1 || (plusCount === 1 && !compact.startsWith('+'))) {
    return { ok: false as const, error: 'Formato de telefone inválido.' };
  }

  const digits = compact.replace(/\+/g, '');
  if (!digits) {
    return { ok: false as const, error: 'Informe um telefone válido.' };
  }

  let normalized: string;

  if (compact.startsWith('+')) {
    if (!digits.startsWith('81')) {
      return { ok: false as const, error: 'Use um número do Japão (+81).' };
    }

    let national = digits.slice(2);
    if (national.startsWith('0')) {
      national = national.slice(1);
    }

    normalized = `+81${national}`;
  } else if (digits.startsWith('0')) {
    normalized = `+81${digits.slice(1)}`;
  } else if (digits.startsWith('81')) {
    normalized = `+${digits}`;
  } else {
    return {
      ok: false as const,
      error: 'Use um número japonês começando com 0, 81 ou +81.',
    };
  }

  if (!JP_E164_PATTERN.test(normalized)) {
    return {
      ok: false as const,
      error: 'Número inválido. Verifique DDD e quantidade de dígitos.',
    };
  }

  return { ok: true as const, e164: normalized };
}

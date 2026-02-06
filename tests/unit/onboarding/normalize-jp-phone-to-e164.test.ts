import { describe, expect, it } from 'vitest';

import { normalizeJPPhoneToE164 } from '@/lib/onboarding/normalize-jp-phone-to-e164';

describe('normalizeJPPhoneToE164', () => {
  it.each([
    ['090-6501-3820', '+819065013820'],
    ['090 6501 3820', '+819065013820'],
    ['09065013820', '+819065013820'],
    ['+81 90-6501-3820', '+819065013820'],
    ['819065013820', '+819065013820'],
    ['07012345678', '+817012345678'],
  ])('normalizes %s into %s', (input, expected) => {
    const result = normalizeJPPhoneToE164(input);

    expect(result).toEqual({ ok: true, e164: expected });
  });

  it.each(['', 'abc', '00-123', '123'])(
    'returns error for invalid input: %s',
    (input) => {
      const result = normalizeJPPhoneToE164(input);

      expect(result.ok).toBe(false);
      if (result.ok === false) {
        expect(result.error.length).toBeGreaterThan(0);
      }
    }
  );
});

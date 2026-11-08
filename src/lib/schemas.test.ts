import { describe, expect, it } from 'vitest';
import { contactFormSchema } from '@/lib/schemas';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Love your work on machine learning.',
};

describe('contactFormSchema', () => {
  it('accepts a well-formed submission', () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a bad email', () => {
    const result = contactFormSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a too-short name and message', () => {
    expect(
      contactFormSchema.safeParse({ ...valid, name: 'A', message: 'Hi' }).success,
    ).toBe(false);
  });

  it('rejects over-limit fields', () => {
    expect(
      contactFormSchema.safeParse({ ...valid, name: 'x'.repeat(51) }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({ ...valid, message: 'x'.repeat(501) }).success,
    ).toBe(false);
  });

  it('rejects missing fields', () => {
    expect(contactFormSchema.safeParse({}).success).toBe(false);
  });
});

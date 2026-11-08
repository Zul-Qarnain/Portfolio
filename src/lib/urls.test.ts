import { describe, expect, it } from 'vitest';
import { cleanExternalUrl, isLinkedInRedirect } from '@/lib/urls';

describe('cleanExternalUrl', () => {
  it('unwraps LinkedIn safety redirects', () => {
    expect(
      cleanExternalUrl(
        'https://www.linkedin.com/safety/go?url=https%3A%2F%2Fexample.com%2Fcert',
      ),
    ).toBe('https://example.com/cert');
  });

  it('rewrites youracclaim badges to credly', () => {
    expect(
      cleanExternalUrl('https://www.youracclaim.com/badges/abc123?source=linked_in_profile'),
    ).toBe('https://www.credly.com/badges/abc123');
  });

  it('strips tracking params but keeps the rest', () => {
    expect(
      cleanExternalUrl('https://example.com/p?trk=feed&source=x&keep=1'),
    ).toBe('https://example.com/p?keep=1');
  });

  it('leaves ordinary urls untouched', () => {
    expect(cleanExternalUrl('https://github.com/Zul-Qarnain')).toBe(
      'https://github.com/Zul-Qarnain',
    );
  });

  it('passes garbage through unchanged instead of throwing', () => {
    expect(cleanExternalUrl('not a url')).toBe('not a url');
    expect(cleanExternalUrl('')).toBe('');
  });
});

describe('isLinkedInRedirect', () => {
  it('spots safety/go links', () => {
    expect(isLinkedInRedirect('https://www.linkedin.com/safety/go?url=x')).toBe(true);
  });

  it('rejects normal links and junk', () => {
    expect(isLinkedInRedirect('https://www.linkedin.com/in/someone')).toBe(false);
    expect(isLinkedInRedirect('https://example.com')).toBe(false);
    expect(isLinkedInRedirect('garbage')).toBe(false);
  });
});

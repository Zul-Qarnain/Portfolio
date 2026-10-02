import { describe, expect, it } from 'vitest';
import {
  isExcludedPath,
  normaliseRecentLimit,
  resolveClientIp,
  sanitizeVisitPath,
} from '@/lib/visits';

const headersOf = (init: Record<string, string>) => new Headers(init);

describe('resolveClientIp', () => {
  it('takes the first hop of a chained x-forwarded-for list', () => {
    expect(resolveClientIp(headersOf({ 'x-forwarded-for': '203.0.113.7, 70.41.3.18' }))).toBe('203.0.113.7');
  });

  it('falls back to x-real-ip', () => {
    expect(resolveClientIp(headersOf({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4');
  });

  it('accepts IPv6', () => {
    expect(resolveClientIp(headersOf({ 'x-forwarded-for': '2001:db8::1' }))).toBe('2001:db8::1');
  });

  it('rejects spoofed non-IP junk and missing headers', () => {
    expect(resolveClientIp(headersOf({ 'x-forwarded-for': 'evil<script>' }))).toBe('unknown');
    expect(resolveClientIp(headersOf({ 'x-forwarded-for': 'not-an-ip' }))).toBe('unknown');
    expect(resolveClientIp(headersOf({}))).toBe('unknown');
  });
});

describe('sanitizeVisitPath', () => {
  it('keeps a plain site path', () => {
    expect(sanitizeVisitPath('/projects')).toBe('/projects');
  });

  it('strips query and hash', () => {
    expect(sanitizeVisitPath('/posts/hello?utm=x#sec')).toBe('/posts/hello');
  });

  it('normalises root and empty-ish values', () => {
    expect(sanitizeVisitPath('/')).toBe('/');
    expect(sanitizeVisitPath('/?ref=1')).toBe('/');
    expect(sanitizeVisitPath('')).toBe('/');
    expect(sanitizeVisitPath(undefined)).toBe('/');
  });

  it('rejects non-site targets', () => {
    expect(sanitizeVisitPath('https://evil.example/x')).toBe('/');
    expect(sanitizeVisitPath('//evil.example/x')).toBe('/');
    expect(sanitizeVisitPath('projects')).toBe('/');
  });

  it('caps length', () => {
    expect(sanitizeVisitPath(`/${'a'.repeat(500)}`).length).toBeLessThanOrEqual(200);
  });
});

describe('isExcludedPath', () => {
  it('excludes admin and api routes but not lookalikes', () => {
    expect(isExcludedPath('/adminpacha/dashboard')).toBe(true);
    expect(isExcludedPath('/api/visit')).toBe(true);
    expect(isExcludedPath('/admin-guide')).toBe(false);
    expect(isExcludedPath('/')).toBe(false);
  });
});

describe('normaliseRecentLimit', () => {
  it('clamps to the supported range', () => {
    expect(normaliseRecentLimit(20)).toBe(20);
    expect(normaliseRecentLimit('50')).toBe(50);
    expect(normaliseRecentLimit(0)).toBe(1);
    expect(normaliseRecentLimit(5000)).toBe(100);
    expect(normaliseRecentLimit('nope')).toBe(20);
  });
});

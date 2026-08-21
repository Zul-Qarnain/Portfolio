export function cleanExternalUrl(raw: string): string {
  try {
    const url = new URL(raw);

    if (url.hostname.endsWith('linkedin.com') && url.pathname.includes('/safety/go')) {
      const destination = url.searchParams.get('url');
      if (destination) {
        return cleanExternalUrl(destination);
      }
    }

    if (url.hostname === 'youracclaim.com' || url.hostname === 'www.youracclaim.com') {
      url.hostname = 'www.credly.com';
    }

    url.searchParams.delete('source');
    url.searchParams.delete('trk');
    url.searchParams.delete('originalSubdomain');

    return url.toString();
  } catch {
    return raw;
  }
}

export function isLinkedInRedirect(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.hostname.endsWith('linkedin.com') && url.pathname.includes('/safety/go');
  } catch {
    return false;
  }
}

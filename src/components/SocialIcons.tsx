import type { SVGProps } from 'react';

export function KaggleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.8 12.4 20.6 7h-3.2l-3.4 4.9L12.4 7H9.1l4.3 6.2L8.8 19h3.3l4.1-5.7 2.1 2.9V19h2.8v-5.3z" />
    </svg>
  );
}

export function HuggingFaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="9" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M8.8 14.6c.9 1.2 2 1.8 3.2 1.8s2.3-.6 3.2-1.8" strokeLinecap="round" />
    </svg>
  );
}

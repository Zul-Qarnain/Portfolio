"use client";
import React, { useEffect, useRef } from 'react';

interface BlogContentProps {
  content: string;
}

const HLJS_VERSION = '11.9.0';

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Highlight.js is roughly 120 KiB from cdnjs. Articles without code samples
    // should not pay for it.
    if (!/<pre[\s>]/i.test(content)) return;

    let cancelled = false;

    const highlight = async () => {
      if (!document.getElementById('hljs-theme')) {
        const link = document.createElement('link');
        link.id = 'hljs-theme';
        link.rel = 'stylesheet';
        link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}/styles/atom-one-dark.min.css`;
        document.head.appendChild(link);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).hljs) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}/highlight.min.js`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('highlight.js failed to load'));
          document.body.appendChild(script);
        });
      }

      if (cancelled) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hljs = (window as any).hljs;
      if (!hljs || !contentRef.current) return;

      contentRef.current
        .querySelectorAll('pre code')
        .forEach((block) => hljs.highlightElement(block as HTMLElement));
    };

    highlight().catch((error) => console.warn('Syntax highlighting skipped:', error));

    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

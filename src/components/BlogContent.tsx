"use client";
import React, { useEffect, useRef } from 'react';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHighlightJs = async () => {
      // Load Atom One Dark CSS theme if it's not already injected
      if (!document.getElementById('hljs-theme')) {
        const link = document.createElement('link');
        link.id = 'hljs-theme';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
        document.head.appendChild(link);
      }

      // Load Highlight.js core script if not available globally
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).hljs) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Execute highlighting on all pre code blocks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (contentRef.current && (window as any).hljs) {
        const codeBlocks = contentRef.current.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).hljs.highlightElement(block as HTMLElement);
        });
      }
    };

    loadHighlightJs();
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-lg"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}

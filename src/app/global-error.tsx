'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to fetch dynamically imported module')
    ) {
      const hasReloaded = sessionStorage.getItem('chunk_error_reloaded');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_error_reloaded', 'true');
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Application Error</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')
            ? 'Application assets were updated. Click below to reload.'
            : 'A critical error occurred while rendering the page.'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              sessionStorage.removeItem('chunk_error_reloaded');
              window.location.reload();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
          <button
            onClick={() => reset()}
            className="px-4 py-2 border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

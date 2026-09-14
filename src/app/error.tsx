'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Automatically recover from ChunkLoadError by refreshing the page to fetch current assets
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')
          ? 'Application assets were updated. Click below to reload.'
          : error.message || 'An unexpected error occurred while loading this page.'}
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
    </div>
  );
}

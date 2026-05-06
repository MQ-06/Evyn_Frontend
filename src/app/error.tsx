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
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-5 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Error</p>
      <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-neutral-950">Something went wrong</h1>
      <p className="mt-2 text-[15px] text-neutral-500">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex h-10 items-center rounded-lg bg-neutral-950 px-6 text-[13px] font-medium text-white hover:bg-neutral-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

interface AuthFormSkeletonProps {
  /** Number of input field rows to render. */
  rows: number;
}

export default function AuthFormSkeleton({ rows }: AuthFormSkeletonProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-10 shadow-sm">
      <div className="mb-8 space-y-2">
        <div className="h-6 w-32 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-64 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3.5 w-16 animate-pulse rounded bg-neutral-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-100" />
          </div>
        ))}
        <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}

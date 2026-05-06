import { Suspense } from 'react';
import SellerSetupForm from './SellerSetupForm';

export const metadata = { title: 'Complete your seller account' };

export default function SellerSetupPage() {
  return (
    <Suspense fallback={<SetupSkeleton />}>
      <SellerSetupForm />
    </Suspense>
  );
}

function SetupSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-10 shadow-sm">
      <div className="mb-8 space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-72 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="space-y-5">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3.5 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-100" />
          </div>
        ))}
        <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}

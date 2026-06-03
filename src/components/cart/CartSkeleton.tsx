import { Skeleton } from '@/components/ui/Skeleton';

export default function CartSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <Skeleton className="mb-8 h-8 w-24" />
      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4">
              <Skeleton className="h-20 w-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-2 h-7 w-32" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="hidden h-64 w-72 rounded-2xl lg:block" />
      </div>
    </div>
  );
}

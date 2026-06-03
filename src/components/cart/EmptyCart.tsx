import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-neutral-950">Cart</h1>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
        <Package size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
        <p className="text-15 font-medium text-neutral-500">Your cart is empty</p>
        <p className="mt-1 text-13 text-neutral-400">Start browsing to add items</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          Browse products <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

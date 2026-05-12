import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Package, Truck, Star } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Evyn — Multi-vendor Marketplace',
  description: 'Discover products from independent sellers. Verified, secure, and fast.',
};

/* ─── Data ────────────────────────────────────────────────────────────────── */

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified sellers only',
    desc: 'Every seller is admin-approved before going live. No unvetted listings, ever.',
  },
  {
    icon: Zap,
    title: 'Atomic checkout',
    desc: 'Stock is reserved at the database level — your order is either fully fulfilled or safely declined.',
  },
  {
    icon: Truck,
    title: 'Live order tracking',
    desc: 'From pending to delivered, get real-time status updates with seller tracking notes.',
  },
  {
    icon: Package,
    title: 'Multi-seller cart',
    desc: 'Add items from multiple sellers in one cart and check out in a single seamless flow.',
  },
  {
    icon: BarChart3,
    title: 'Seller dashboard',
    desc: 'Inventory, orders, and performance metrics — all in one place for sellers.',
  },
  {
    icon: Star,
    title: 'Price snapshots',
    desc: 'Order history always shows the price you paid, even if the product is edited later.',
  },
];

const steps = [
  { n: '01', title: 'Create an account', desc: 'Sign up as a buyer in seconds. No credit card required to browse.' },
  { n: '02', title: 'Browse & add to cart', desc: 'Filter by category, price, or availability. Add items from any seller.' },
  { n: '03', title: 'Checkout securely', desc: 'Enter your shipping address and place your order. Stock is locked instantly.' },
];

/* ─── Featured products server fetch ─────────────────────────────────────── */

async function FeaturedProducts() {
  const toArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  const [rawProducts, rawCategories] = await Promise.all([
    serverFetch<{ items: Product[] }>('/products?sort=newest&limit=8', { revalidate: 0 }).catch(() => ({ items: [] })),
    serverFetch<unknown>('/categories', { revalidate: 0 }).catch(() => []),
  ]);

  const products = toArray<Product>(rawProducts?.items);
  const categories = toArray<Category>(rawCategories);

  if (products.length === 0) return null;

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-widest text-neutral-400">
              Just in
            </p>
            <h2 className="text-[1.75rem] font-bold tracking-tight text-neutral-950">
              Latest arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            <Link
              href="/products"
              className="shrink-0 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[12px] font-medium text-neutral-600 hover:border-neutral-300 transition-colors"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="shrink-0 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[12px] font-medium text-neutral-600 hover:border-neutral-300 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-950 px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">

          <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Multi-vendor marketplace
          </p>

          <h1 className="max-w-2xl text-[2.75rem] font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            The marketplace built for independent sellers.
          </h1>

          <p className="mt-7 max-w-md text-[16px] leading-relaxed text-neutral-400">
            Evyn connects verified sellers with buyers who care about quality. Browse, buy, and track every order — all in one place.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-100 active:scale-[0.98]"
            >
              Browse products
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
            >
              Create account
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-10 border-t border-neutral-800 pt-8">
            {[
              { n: '2,400+', label: 'Products listed' },
              { n: '180+',   label: 'Verified sellers' },
              { n: '5,000+', label: 'Orders fulfilled' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="text-[2rem] font-bold tracking-tight text-white">{n}</p>
                <p className="mt-0.5 text-[13px] text-neutral-500">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Featured products (live from backend) ─────────────────────────── */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <div className="mb-8 h-8 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <FeaturedProducts />
      </Suspense>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-100 bg-neutral-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-neutral-400">Platform</p>
            <h2 className="text-[1.75rem] font-bold tracking-[-0.02em] text-neutral-950 sm:text-3xl">
              Built for the full commerce lifecycle
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
                  <Icon size={18} strokeWidth={1.75} className="text-neutral-700" />
                </div>
                <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-950">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-12 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.02em] text-neutral-950 sm:text-3xl">
              Up and running in minutes.
            </h2>
            <p className="text-[13px] text-neutral-400 sm:text-right">Three steps. No friction.</p>
          </div>

          <div className="divide-y divide-neutral-100">
            {steps.map(({ n, title, desc }) => (
              <div
                key={n}
                className="group flex flex-col gap-3 py-8 sm:flex-row sm:items-start sm:gap-12"
              >
                <span className="shrink-0 font-mono text-[3rem] font-bold leading-none tracking-tighter text-neutral-100 transition-colors group-hover:text-neutral-200 sm:w-24 sm:text-right">
                  {n}
                </span>
                <div className="flex-1 pt-1">
                  <h3 className="text-[18px] font-semibold text-neutral-950">{title}</h3>
                  <p className="mt-2 max-w-md text-[14px] leading-relaxed text-neutral-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-neutral-100 bg-neutral-50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[1.5rem] font-bold tracking-[-0.02em] text-neutral-950">
                Ready to start shopping?
              </h2>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-neutral-500">
                Join thousands of buyers discovering unique products from verified independent sellers.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]"
              >
                Create free account
              </Link>
              <Link
                href="/products"
                className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-950"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

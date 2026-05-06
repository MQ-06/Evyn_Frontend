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
    serverFetch<{ items: Product[] }>('/products?sort=newest&limit=8').catch(() => ({ items: [] })),
    serverFetch<unknown>('/categories').catch(() => []),
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
      <section className="relative flex flex-col items-center px-5 pb-24 pt-20 text-center sm:pt-28 sm:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-neutral-50 to-transparent"
        />

        <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[13px] font-medium text-neutral-600">Multi-vendor marketplace</span>
        </div>

        <h1 className="relative max-w-3xl text-balance text-[2.75rem] font-bold leading-[1.07] tracking-[-0.03em] text-neutral-950 sm:text-[3.75rem] lg:text-[4.5rem]">
          Where independent sellers{' '}
          <span className="text-neutral-400">meet their customers.</span>
        </h1>

        <p className="relative mt-6 max-w-lg text-base leading-relaxed text-neutral-500 sm:text-lg">
          Evyn is a curated marketplace built for verified sellers and discerning buyers.
          Browse, buy, and track — all in one clean experience.
        </p>

        <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Browse products
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            Create account
          </Link>
        </div>

        <div className="relative mt-14 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {['No unverified sellers', 'Free shipping over $50', 'Price history on every order'].map((t) => (
            <span key={t} className="flex items-center gap-2 text-[13px] text-neutral-400">
              <span className="h-px w-4 bg-neutral-300" />
              {t}
            </span>
          ))}
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
              <div key={title} className="group rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md">
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
          <div className="mb-14 text-center">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-neutral-400">For buyers</p>
            <h2 className="text-[1.75rem] font-bold tracking-[-0.02em] text-neutral-950 sm:text-3xl">
              From signup to delivered in minutes
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col gap-4 rounded-xl border border-neutral-100 p-7">
                <span className="font-mono text-[13px] font-medium text-neutral-300">{n}</span>
                <div>
                  <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-950">{title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center rounded-2xl bg-neutral-950 px-8 py-16 text-center">
            <h2 className="max-w-md text-[1.75rem] font-bold tracking-[-0.02em] text-white sm:text-3xl">
              Ready to start shopping?
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-neutral-400">
              Join thousands of buyers discovering unique products from independent sellers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-100">
                Create free account
              </Link>
              <Link href="/products" className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white">
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

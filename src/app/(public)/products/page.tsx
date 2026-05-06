import { Suspense } from 'react';
import type { Metadata } from 'next';
import { serverFetch, buildQuery } from '@/lib/server-api';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/shared/ProductCard';
import ProductFilters from './ProductFilters';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = { title: 'Products' };

interface PageProps {
  searchParams: {
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    page?: string;
  };
}

const LIMIT = 24;

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page ?? 1);

  const toArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  const [rawProducts, rawCategories] = await Promise.all([
    serverFetch<{ items: Product[]; totalPages: number }>(
      `/products${buildQuery({
        categoryId: searchParams.categoryId,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        inStock: searchParams.inStock,
        sort: searchParams.sort ?? 'newest',
        page,
        limit: LIMIT,
      })}`
    ).catch(() => ({ items: [], totalPages: 1 })),
    serverFetch<unknown>('/categories').catch(() => []),
  ]);

  const products = toArray<Product>(rawProducts?.items);
  const categories = toArray<Category>(rawCategories);

  const hasMore = page < (rawProducts?.totalPages ?? 1);
  const activeCategoryName = categories.find(
    (c) => c.id === searchParams.categoryId
  )?.name;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-neutral-950">
          {activeCategoryName ?? 'All products'}
        </h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          {products.length === 0
            ? 'No products found'
            : `${products.length}${hasMore ? '+' : ''} product${products.length === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="flex gap-10">
        {/* Sidebar filters — wrapped in Suspense because it uses useSearchParams */}
        <div className="hidden w-52 shrink-0 lg:block">
          <Suspense fallback={<FiltersSkeleton />}>
            <ProductFilters categories={categories} />
          </Suspense>
        </div>

        {/* Product grid + pagination */}
        <div className="flex-1">
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              <Suspense fallback={null}>
                <ProductsClient page={page} hasMore={hasMore} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
      <p className="text-[15px] font-medium text-neutral-500">No products found</p>
      <p className="mt-1 text-[13px] text-neutral-400">Try adjusting your filters</p>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[80, 120, 96, 64].map((w, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-3 w-${w / 4} animate-pulse rounded bg-neutral-100`} />
          <div className="space-y-1.5">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-7 animate-pulse rounded-lg bg-neutral-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

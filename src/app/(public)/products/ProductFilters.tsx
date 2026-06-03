'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = {
    categoryId: searchParams.get('categoryId') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    inStock: searchParams.get('inStock') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
  };

  const hasActiveFilters =
    current.categoryId || current.minPrice || current.maxPrice || current.inStock;

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  return (
    <aside className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-13 font-semibold text-neutral-700">
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort by">
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-neutral-50 transition-colors"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={current.sort === opt.value}
                onChange={() => update('sort', opt.value)}
                className="accent-neutral-950"
              />
              <span className="text-13 text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Category">
          <div className="flex flex-col gap-1">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-neutral-50 transition-colors">
              <input
                type="radio"
                name="category"
                value=""
                checked={!current.categoryId}
                onChange={() => update('categoryId', '')}
                className="accent-neutral-950"
              />
              <span className="text-13 text-neutral-700">All categories</span>
            </label>
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-neutral-50 transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={current.categoryId === cat.id}
                  onChange={() => update('categoryId', cat.id)}
                  className="accent-neutral-950"
                />
                <span className="text-13 text-neutral-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price range */}
      <FilterSection title="Price range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={current.minPrice}
            onChange={(e) => update('minPrice', e.target.value)}
            className="h-8 w-full rounded-lg border border-neutral-200 px-2.5 text-13 text-neutral-900 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
          />
          <span className="shrink-0 text-xs text-neutral-400">to</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={current.maxPrice}
            onChange={(e) => update('maxPrice', e.target.value)}
            className="h-8 w-full rounded-lg border border-neutral-200 px-2.5 text-13 text-neutral-900 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
          />
        </div>
      </FilterSection>

      {/* In stock */}
      <FilterSection title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-neutral-50 transition-colors">
          <input
            type="checkbox"
            checked={current.inStock === 'true'}
            onChange={(e) => update('inStock', e.target.checked ? 'true' : '')}
            className="accent-neutral-950"
          />
          <span className="text-13 text-neutral-700">In stock only</span>
        </label>
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-11 font-semibold uppercase tracking-wider text-neutral-400">
        {title}
      </p>
      {children}
    </div>
  );
}

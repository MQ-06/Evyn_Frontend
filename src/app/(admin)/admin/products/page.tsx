'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { useAdminProducts } from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/auth';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">Products</h1>
        {!isLoading && (
          <p className="mt-1 text-[14px] text-neutral-500">
            {products?.length ?? 0} product{products?.length !== 1 ? 's' : ''} across all sellers
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
        </div>
      ) : !products?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <Package size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
          <p className="text-[15px] font-medium text-neutral-500">No products yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-neutral-100 px-5 py-3">
            <span />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Product</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Seller</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Price</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Stock</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Status</span>
          </div>

          <div className="divide-y divide-neutral-50">
            {products.map((product) => (
              <div key={product.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4">
                {/* Thumbnail */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={16} strokeWidth={1.5} className="text-neutral-300" />
                    </div>
                  )}
                </div>

                {/* Name + category */}
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-neutral-900">{product.name}</p>
                  {product.category && (
                    <p className="text-[12px] text-neutral-400">{product.category.name}</p>
                  )}
                </div>

                {/* Seller */}
                <span className="max-w-[120px] truncate text-[12px] text-neutral-500">
                  {product.seller?.businessName ?? product.seller?.name ?? '—'}
                </span>

                {/* Price */}
                <span className="text-[13px] text-neutral-700">{formatPrice(product.price)}</span>

                {/* Stock */}
                <span className={`text-[13px] ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-500' : 'text-neutral-600'}`}>
                  {product.stock}
                </span>

                {/* Status */}
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  product.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

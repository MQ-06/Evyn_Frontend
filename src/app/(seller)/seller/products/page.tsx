'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Pencil, Trash2, ToggleLeft, ToggleRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSellerProducts, useToggleProduct, useDeleteProduct } from '@/hooks/useSellerProducts';
import { formatPrice } from '@/lib/auth';
import { getApiError } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SellerProductsPage() {
  const { data: products, isLoading } = useSellerProducts();
  const toggleProduct = useToggleProduct();
  const deleteProduct = useDeleteProduct();

  async function handleToggle(id: string, isActive: boolean) {
    try {
      await toggleProduct.mutateAsync(id);
      toast.success(isActive ? 'Product deactivated' : 'Product activated');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">Products</h1>
          {!isLoading && (
            <p className="mt-1 text-[14px] text-neutral-500">
              {products?.length ?? 0} listing{products?.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          <PlusCircle size={14} />
          Add product
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
        </div>
      ) : !products?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <Package size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
          <p className="text-[15px] font-medium text-neutral-500">No products yet</p>
          <p className="mt-1 text-[13px] text-neutral-400">Add your first listing to start selling</p>
          <Link
            href="/seller/products/new"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            <PlusCircle size={14} /> Add product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          <div className="divide-y divide-neutral-50">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-5 py-4">
                {/* Thumbnail */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={18} strokeWidth={1.5} className="text-neutral-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-semibold text-neutral-900">{product.name}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-[12px] text-neutral-400">
                    <span>{formatPrice(product.price)}</span>
                    <span>·</span>
                    <span>{product.stock} in stock</span>
                    {product.category && <><span>·</span><span>{product.category.name}</span></>}
                  </div>
                </div>

                {/* Status */}
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  product.isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleToggle(product.id, product.isActive)}
                    disabled={toggleProduct.isPending}
                    title={product.isActive ? 'Deactivate' : 'Activate'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    {product.isActive
                      ? <ToggleRight size={16} className="text-emerald-600" />
                      : <ToggleLeft size={16} />}
                  </button>
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleteProduct.isPending}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import ProductForm, { type ProductFormValues } from '../../ProductForm';
import type { Category, Product } from '@/types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['seller-product', id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/seller/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    },
  });

  async function handleSubmit(values: ProductFormValues, images: string[]) {
    try {
      await api.patch(`/seller/products/${id}`, { ...values, images });
      toast.success('Product updated');
      router.push('/seller/products');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  const isLoading = loadingProduct || loadingCategories;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/seller/products"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">Edit product</h1>
          {product && (
            <p className="mt-0.5 text-[13px] text-neutral-500 truncate max-w-xs">{product.name}</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : product ? (
        <ProductForm
          categories={categories}
          defaultValues={{
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId ?? '',
            isActive: product.isActive,
          }}
          defaultImages={product.images ?? []}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-[14px] text-neutral-500">Product not found</p>
        </div>
      )}
    </div>
  );
}

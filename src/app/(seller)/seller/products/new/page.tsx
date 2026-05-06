'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import ProductForm, { type ProductFormValues } from '../ProductForm';
import type { Category } from '@/types';

export default function NewProductPage() {
  const router = useRouter();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    },
  });

  async function handleSubmit(values: ProductFormValues, images: string[]) {
    try {
      await api.post('/seller/products', { ...values, images });
      toast.success('Product created');
      router.push('/seller/products');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

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
          <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">New product</h1>
          <p className="mt-0.5 text-[13px] text-neutral-500">Fill in the details below to list a new product</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : (
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Create product"
        />
      )}
    </div>
  );
}

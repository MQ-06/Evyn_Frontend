'use client';

import { useState } from 'react';
import { Tag, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    },
  });

  const create = useMutation({
    mutationFn: (name: string) => api.post<Category>('/admin/categories', { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      toast.success('Category created');
    },
    onError: (err) => toast.error(getApiError(err)),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate(name.trim());
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">Categories</h1>
        {!isLoading && (
          <p className="mt-1 text-[14px] text-neutral-500">
            {categories?.length ?? 0} categor{categories?.length !== 1 ? 'ies' : 'y'}
          </p>
        )}
      </div>

      {/* Create form */}
      <div className="mb-6 rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-[14px] font-semibold text-neutral-900">Add category</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electronics"
            className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
          />
          <button
            type="submit"
            disabled={create.isPending || !name.trim()}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-neutral-950 px-4 text-[13px] font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </form>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
        </div>
      ) : !categories?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
          <Tag size={32} strokeWidth={1.25} className="mb-3 text-neutral-300" />
          <p className="text-[14px] font-medium text-neutral-500">No categories yet</p>
          <p className="mt-1 text-[13px] text-neutral-400">Add your first category above</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          <div className="divide-y divide-neutral-50">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-[14px] font-medium text-neutral-900">{cat.name}</p>
                  <p className="text-[12px] text-neutral-400">/{cat.slug}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

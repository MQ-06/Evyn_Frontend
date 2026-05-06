'use client';

import { Users, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminBuyers, useToggleBuyer, useDeleteBuyer } from '@/hooks/useAdmin';
import { formatDate } from '@/lib/auth';
import { getApiError } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminBuyersPage() {
  const { data: buyers, isLoading } = useAdminBuyers();
  const toggleBuyer = useToggleBuyer();
  const deleteBuyer = useDeleteBuyer();

  async function handleToggle(id: string, isActive: boolean) {
    try {
      await toggleBuyer.mutateAsync(id);
      toast.success(isActive ? 'Buyer deactivated' : 'Buyer activated');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete buyer "${name}"? This cannot be undone.`)) return;
    try {
      await deleteBuyer.mutateAsync(id);
      toast.success('Buyer deleted');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">Buyers</h1>
        {!isLoading && (
          <p className="mt-1 text-[14px] text-neutral-500">
            {buyers?.length ?? 0} buyer{buyers?.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      ) : !buyers?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <Users size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
          <p className="text-[15px] font-medium text-neutral-500">No buyers yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-100 px-5 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Buyer</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Joined</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Status</span>
            <span />
          </div>

          <div className="divide-y divide-neutral-50">
            {buyers.map((buyer) => (
              <div key={buyer.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-neutral-900">{buyer.name}</p>
                  <p className="truncate text-[12px] text-neutral-400">{buyer.email}</p>
                  {buyer.phone && <p className="text-[11px] text-neutral-300">{buyer.phone}</p>}
                </div>

                <span className="text-[13px] text-neutral-500">{formatDate(buyer.createdAt)}</span>

                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  buyer.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {buyer.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleToggle(buyer.id, buyer.isActive)}
                    disabled={toggleBuyer.isPending}
                    title={buyer.isActive ? 'Deactivate' : 'Activate'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    {buyer.isActive
                      ? <ToggleRight size={16} className="text-emerald-600" />
                      : <ToggleLeft size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(buyer.id, buyer.name)}
                    disabled={deleteBuyer.isPending}
                    title="Delete buyer"
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

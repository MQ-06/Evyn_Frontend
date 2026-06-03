'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, ToggleLeft, ToggleRight, Trash2, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminSellers, useToggleSeller, useDeleteSeller } from '@/hooks/useAdmin';
import { formatDate } from '@/lib/auth';
import { getApiError } from '@/lib/utils';
import { inputCls } from '@/lib/styles';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api';

const inviteSchema = z.object({
  name:         z.string().min(2, 'Name required'),
  email:        z.string().email('Enter a valid email'),
  businessName: z.string().min(2, 'Business name required'),
  phone:        z.string().optional(),
});
type InviteValues = z.infer<typeof inviteSchema>;

export default function AdminSellersPage() {
  const { data: sellers, isLoading, refetch } = useAdminSellers();
  const toggleSeller = useToggleSeller();
  const deleteSeller = useDeleteSeller();
  const [showInvite, setShowInvite] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({ resolver: zodResolver(inviteSchema) });

  async function handleInvite(values: InviteValues) {
    try {
      await api.post('/auth/invite-seller', values);
      toast.success(`Invite sent to ${values.email}`);
      reset();
      setShowInvite(false);
      refetch();
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      await toggleSeller.mutateAsync(id);
      toast.success(isActive ? 'Seller deactivated' : 'Seller activated');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete seller "${name}"? This cannot be undone.`)) return;
    try {
      await deleteSeller.mutateAsync(id);
      toast.success('Seller deleted');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Sellers</h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-neutral-500">
              {sellers?.length ?? 0} seller{sellers?.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2.5 text-13 font-medium text-white hover:bg-neutral-800 transition-colors"
        >
          <UserPlus size={14} />
          Invite seller
        </button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-15 font-semibold text-neutral-950">Invite a seller</h2>
              <button
                onClick={() => { setShowInvite(false); reset(); }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleInvite)} noValidate className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-13 font-medium text-neutral-700">Full name</label>
                <input {...register('name')} placeholder="Jane Smith" className={inputCls} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-13 font-medium text-neutral-700">Email</label>
                <input {...register('email')} type="email" placeholder="jane@example.com" className={inputCls} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-13 font-medium text-neutral-700">Business name</label>
                <input {...register('businessName')} placeholder="Artisan Goods Co." className={inputCls} />
                {errors.businessName && <p className="text-xs text-red-500">{errors.businessName.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-13 font-medium text-neutral-700">
                  Phone <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input {...register('phone')} type="tel" placeholder="+1 555 000 0000" className={inputCls} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowInvite(false); reset(); }}
                  className="h-9 rounded-lg border border-neutral-200 px-4 text-13 font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-9 items-center gap-2 rounded-lg bg-neutral-950 px-5 text-13 font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting
                    ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : 'Send invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      ) : !sellers?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <Store size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
          <p className="text-15 font-medium text-neutral-500">No sellers yet</p>
          <p className="mt-1 text-13 text-neutral-400">Invite your first seller to get started</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-neutral-100 px-5 py-3">
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Seller</span>
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Products</span>
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Orders</span>
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Status</span>
            <span />
          </div>

          <div className="divide-y divide-neutral-50">
            {sellers.map((seller) => (
              <div key={seller.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900">{seller.name}</p>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="truncate">{seller.email}</span>
                    {seller.businessName && (
                      <><span>·</span><span className="truncate">{seller.businessName}</span></>
                    )}
                  </div>
                  <p className="text-11 text-neutral-300">{formatDate(seller.createdAt)}</p>
                </div>

                <span className="text-13 text-neutral-600">{seller.productCount ?? 0}</span>
                <span className="text-13 text-neutral-600">{seller.orderCount ?? 0}</span>

                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-11 font-medium ${
                  seller.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {seller.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleToggle(seller.id, seller.isActive)}
                    disabled={toggleSeller.isPending}
                    title={seller.isActive ? 'Deactivate' : 'Activate'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40 transition-colors"
                  >
                    {seller.isActive
                      ? <ToggleRight size={16} className="text-emerald-600" />
                      : <ToggleLeft size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(seller.id, seller.name)}
                    disabled={deleteSeller.isPending}
                    title="Delete seller"
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

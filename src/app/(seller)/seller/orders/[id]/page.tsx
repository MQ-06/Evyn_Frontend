'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSellerOrder, useUpdateOrderStatus } from '@/hooks/useSellerOrders';
import { formatPrice, formatDate } from '@/lib/auth';
import { getApiError } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import type { OrderStatus } from '@/types';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: order, isLoading } = useSellerOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const [trackingNote, setTrackingNote] = useState('');

  async function handleStatusUpdate(status: OrderStatus) {
    try {
      await updateStatus.mutateAsync({ id, status, trackingNote: trackingNote || undefined });
      toast.success(`Order marked as ${STATUS_LABELS[status].toLowerCase()}`);
      setTrackingNote('');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
        <p className="text-[14px] text-neutral-500">Order not found</p>
        <Link href="/seller/orders" className="mt-4 inline-block text-[13px] text-neutral-400 underline underline-offset-2">
          Back to orders
        </Link>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(order.status as OrderStatus);
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : null;
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/seller/orders"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-[1.25rem] font-bold tracking-tight text-neutral-950">
              #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-500">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Status update */}
      {!isCancelled && nextStatus && (
        <div className="mb-4 rounded-2xl border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-[14px] font-semibold text-neutral-900">Update status</h2>
          <div className="mb-3">
            <label className="mb-1.5 block text-[12px] font-medium text-neutral-600">
              Tracking note <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              value={trackingNote}
              onChange={(e) => setTrackingNote(e.target.value)}
              placeholder="e.g. Shipped via FedEx — tracking #ABC123"
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusUpdate(nextStatus)}
              disabled={updateStatus.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 transition-colors"
            >
              {updateStatus.isPending ? 'Updating…' : `Mark as ${STATUS_LABELS[nextStatus]}`}
            </button>
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updateStatus.isPending}
                className="rounded-lg border border-red-200 px-4 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
              >
                Cancel order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tracking note display */}
      {order.trackingNote && (
        <div className="mb-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">Tracking note</p>
          <p className="mt-1 text-[14px] text-neutral-700">{order.trackingNote}</p>
        </div>
      )}

      {/* Items */}
      <div className="mb-4 rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-[14px] font-semibold text-neutral-900">Items</h2>
        <div className="divide-y divide-neutral-50">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <Package size={18} strokeWidth={1.5} className="text-neutral-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[14px] font-medium text-neutral-900">{item.productName}</p>
                <p className="text-[12px] text-neutral-400">Qty: {item.quantity} · {formatPrice(item.unitPrice)} each</p>
              </div>
              <p className="shrink-0 text-[14px] font-medium text-neutral-900">{formatPrice(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4 rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-[14px] font-semibold text-neutral-900">Pricing</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-[13px] text-neutral-600">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.total) - Number(order.shippingCost ?? 0))}</span>
          </div>
          <div className="flex justify-between text-[13px] text-neutral-600">
            <span>Shipping</span>
            <span>{Number(order.shippingCost) === 0 ? 'Free' : formatPrice(order.shippingCost ?? 0)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-[14px] font-semibold text-neutral-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6">
          <h2 className="mb-3 text-[14px] font-semibold text-neutral-900">Ship to</h2>
          <div className="space-y-0.5 text-[13px] text-neutral-600">
            <p className="font-medium text-neutral-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p className="mt-1 text-neutral-400">{order.shippingAddress.phone}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

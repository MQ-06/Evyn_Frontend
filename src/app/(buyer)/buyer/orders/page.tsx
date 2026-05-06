'use client';

import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice, formatDate } from '@/lib/auth';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import { OrderRowSkeleton } from '@/components/ui/Skeleton';

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div>
      <h1 className="mb-8 text-[1.5rem] font-bold tracking-tight text-neutral-950">Orders</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <OrderRowSkeleton key={i} />)}
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <Package size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
          <p className="text-[15px] font-medium text-neutral-500">No orders yet</p>
          <p className="mt-1 text-[13px] text-neutral-400">Place your first order to see it here</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Browse products <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_80px_80px_32px] items-center gap-4 border-b border-neutral-100 px-5 py-3">
            {['Order', 'Date', 'Status', 'Total', ''].map((h) => (
              <p key={h} className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-neutral-50">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/buyer/orders/${order.id}`}
                className="grid grid-cols-[1fr_120px_80px_80px_32px] items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <p className="font-mono text-[13px] font-medium text-neutral-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-[12px] text-neutral-400">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-[13px] text-neutral-600">{formatDate(order.createdAt)}</p>
                <div><OrderStatusBadge status={order.status} /></div>
                <p className="text-[13px] font-medium text-neutral-950">{formatPrice(order.total)}</p>
                <ArrowRight size={14} className="text-neutral-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { useSellerOrders } from '@/hooks/useSellerOrders';
import { formatPrice, formatDate } from '@/lib/auth';
import { Skeleton } from '@/components/ui/Skeleton';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';

export default function SellerOrdersPage() {
  const { data: orders, isLoading } = useSellerOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Orders</h1>
        {!isLoading && (
          <p className="mt-1 text-sm text-neutral-500">
            {orders?.length ?? 0} order{orders?.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      ) : !orders?.length ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When buyers purchase your products, their orders will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-neutral-100 px-5 py-3">
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Order</span>
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Date</span>
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Status</span>
            <span className="text-11 font-semibold uppercase tracking-wider text-neutral-400">Total</span>
            <span />
          </div>

          <div className="divide-y divide-neutral-50">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/seller/orders/${order.id}`}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <p className="font-mono text-13 font-medium text-neutral-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="text-13 text-neutral-500">{formatDate(order.createdAt)}</span>
                <OrderStatusBadge status={order.status} />
                <span className="text-13 font-medium text-neutral-900">{formatPrice(order.total)}</span>
                <ArrowRight size={14} className="text-neutral-300" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

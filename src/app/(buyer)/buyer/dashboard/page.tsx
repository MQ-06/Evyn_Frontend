'use client';

import Link from 'next/link';
import { ShoppingCart, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/auth';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const dateLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});

export default function BuyerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: cart } = useCart();
  const { data: orders } = useOrders();

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const orderCount = orders?.length ?? 0;
  const recentOrders = orders?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
        <div>
          <p className="mb-1 text-[13px] text-neutral-400">{dateLabel}</p>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-neutral-950">
            {greeting()}, {firstName}.
          </h1>
          <p className="mt-1 text-[13px] text-neutral-500">Here&apos;s your account overview.</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <ShoppingBag size={13} />
          Browse
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/buyer/cart"
          className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:border-neutral-200 hover:shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Cart</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50">
              <ShoppingCart size={13} strokeWidth={1.75} className="text-sky-500" />
            </div>
          </div>
          <p className="text-[2.25rem] font-bold leading-none tracking-tight text-neutral-950">{cartCount}</p>
          <p className="mt-2 text-[12px] text-neutral-400">
            {cartCount === 1 ? 'item' : 'items'} in cart
          </p>
        </Link>

        <Link
          href="/buyer/orders"
          className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:border-neutral-200 hover:shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Orders</p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
              <Package size={13} strokeWidth={1.75} className="text-amber-500" />
            </div>
          </div>
          <p className="text-[2.25rem] font-bold leading-none tracking-tight text-neutral-950">{orderCount}</p>
          <p className="mt-2 text-[12px] text-neutral-400">
            {orderCount === 1 ? 'order' : 'orders'} placed
          </p>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-neutral-100 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">Recent orders</h2>
          <Link
            href="/buyer/orders"
            className="flex items-center gap-1 text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length ? (
          <div className="divide-y divide-neutral-50">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/buyer/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="font-mono text-[13px] font-semibold text-neutral-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-[12px] text-neutral-400">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <p className="w-16 text-right text-[13px] font-medium text-neutral-900">
                    {formatPrice(order.total)}
                  </p>
                  <ArrowRight size={13} className="text-neutral-300" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-neutral-400">No orders yet.</p>
            <Link
              href="/products"
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-neutral-900 hover:underline"
            >
              Start browsing <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

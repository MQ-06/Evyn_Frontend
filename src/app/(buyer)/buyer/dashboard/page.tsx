'use client';

import Link from 'next/link';
import { ShoppingCart, Package, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';

export default function BuyerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: cart } = useCart();
  const { data: orders } = useOrders();

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const recentOrder = orders?.[0];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">
          Hello, {firstName} 👋
        </h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          Here&apos;s a quick look at your account.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/buyer/cart"
          className="group flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">Cart</p>
            <p className="mt-1.5 text-[2rem] font-bold tracking-tight text-neutral-950">
              {cart?.itemCount ?? 0}
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              {cart?.itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
            <ShoppingCart size={20} strokeWidth={1.75} className="text-neutral-700" />
          </div>
        </Link>

        <Link
          href="/buyer/orders"
          className="group flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">Orders</p>
            <p className="mt-1.5 text-[2rem] font-bold tracking-tight text-neutral-950">
              {orders?.length ?? 0}
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">
              {orders?.length === 1 ? 'order' : 'orders'} placed
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
            <Package size={20} strokeWidth={1.75} className="text-neutral-700" />
          </div>
        </Link>
      </div>

      {/* Recent order */}
      {recentOrder && (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-neutral-900">Most recent order</h2>
            <Link
              href="/buyer/orders"
              className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <Link
            href={`/buyer/orders/${recentOrder.id}`}
            className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 hover:bg-neutral-100 transition-colors"
          >
            <div>
              <p className="text-[13px] font-medium text-neutral-900">
                #{recentOrder.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-[12px] text-neutral-400">
                {recentOrder.items.length} item{recentOrder.items.length !== 1 ? 's' : ''} ·{' '}
                {new Date(recentOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <ArrowRight size={14} className="text-neutral-400" />
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="mt-6 rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-[14px] font-semibold text-neutral-900">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Browse products
          </Link>
          <Link
            href="/buyer/cart"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            View cart
          </Link>
          <Link
            href="/buyer/profile"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}

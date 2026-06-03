'use client';

import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp, ArrowRight, PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useSellerProducts } from '@/hooks/useSellerProducts';
import { useSellerOrders } from '@/hooks/useSellerOrders';
import { formatPrice, greeting, getTodayLabel, getFirstName, formatOrderId } from '@/lib/auth';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import StatCard from '@/components/shared/StatCard';

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: products } = useSellerProducts();
  const { data: orders } = useSellerOrders();

  const firstName = getFirstName(user?.name);
  const activeProducts = products?.filter((p) => p.isActive).length ?? 0;
  const pendingOrders  = orders?.filter((o) => o.status === 'pending').length ?? 0;
  const totalRevenue   = orders
    ?.filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
        <div>
          <p className="mb-1 text-13 text-neutral-400">{getTodayLabel()}</p>
          <h1 className="text-heading font-bold tracking-tight text-neutral-950">
            {greeting()}, {firstName}.
          </h1>
          {user?.businessName && (
            <p className="mt-1 text-13 text-neutral-500">{user.businessName}</p>
          )}
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-13 font-medium text-white transition-colors hover:bg-neutral-700"
        >
          <PlusCircle size={13} />
          Add product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          href="/seller/products"
          label="Active listings"
          value={activeProducts}
          sub={`${products?.length ?? 0} total`}
          icon={Package}
          color="blue"
        />
        <StatCard
          href="/seller/orders"
          label="Pending orders"
          value={pendingOrders}
          sub="awaiting action"
          icon={ShoppingBag}
          color="amber"
        />
        <StatCard
          href="/seller/orders"
          label="Total revenue"
          value={formatPrice(totalRevenue)}
          sub="non-cancelled orders"
          icon={TrendingUp}
          color="emerald"
          isText
        />
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-neutral-100 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">Recent orders</h2>
          <Link
            href="/seller/orders"
            className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {orders?.length ? (
          <div className="divide-y divide-neutral-50">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/seller/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="font-mono text-13 font-semibold text-neutral-900">
                    {formatOrderId(order.id)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <p className="w-20 text-right text-13 font-medium text-neutral-900">
                    {formatPrice(order.total)}
                  </p>
                  <ArrowRight size={13} className="text-neutral-300" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-13 text-neutral-400">
            No orders yet. They&apos;ll appear here once buyers purchase your products.
          </p>
        )}
      </div>

      {/* Products summary */}
      {!!products?.length && (
        <div className="rounded-2xl border border-neutral-100 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">Your listings</h2>
            <Link
              href="/seller/products"
              className="flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
            >
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-13 font-medium text-neutral-900">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.stock} in stock</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-2 py-0.5 text-11 font-medium ${
                    p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p className="w-16 text-right text-13 font-medium text-neutral-700">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

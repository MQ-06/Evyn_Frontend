'use client';

import Link from 'next/link';
import { Package, ShoppingBag, PlusCircle, ArrowRight, TrendingUp, type LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useSellerProducts } from '@/hooks/useSellerProducts';
import { useSellerOrders } from '@/hooks/useSellerOrders';
import { formatPrice } from '@/lib/auth';

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: products } = useSellerProducts();
  const { data: orders } = useSellerOrders();

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const activeProducts = products?.filter((p) => p.isActive).length ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === 'pending').length ?? 0;
  const totalRevenue = orders
    ?.filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">
          Hello, {firstName} 👋
        </h1>
        <p className="mt-1 text-[14px] text-neutral-500">
          {user?.businessName && <span className="font-medium text-neutral-700">{user.businessName} · </span>}
          Seller dashboard
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          href="/seller/products"
          label="Active listings"
          value={activeProducts}
          sub={`of ${products?.length ?? 0} total`}
          icon={Package}
        />
        <StatCard
          href="/seller/orders"
          label="Pending orders"
          value={pendingOrders}
          sub="awaiting confirmation"
          icon={ShoppingBag}
        />
        <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">Revenue</p>
            <p className="mt-1.5 text-[1.5rem] font-bold tracking-tight text-neutral-950">
              {formatPrice(totalRevenue)}
            </p>
            <p className="mt-0.5 text-[13px] text-neutral-500">all time (non-cancelled)</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
            <TrendingUp size={20} strokeWidth={1.75} className="text-neutral-700" />
          </div>
        </div>
      </div>

      {/* Recent orders */}
      {!!orders?.length && (
        <div className="mb-6 rounded-2xl border border-neutral-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-neutral-900">Recent orders</h2>
            <Link href="/seller/orders" className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 4).map((order) => (
              <Link
                key={order.id}
                href={`/seller/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 hover:bg-neutral-100 transition-colors"
              >
                <div>
                  <p className="font-mono text-[13px] font-medium text-neutral-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-[12px] text-neutral-400 capitalize">{order.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[13px] font-medium text-neutral-700">{formatPrice(order.total)}</p>
                  <ArrowRight size={13} className="text-neutral-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-[14px] font-semibold text-neutral-900">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/seller/products/new"
            className="flex items-center gap-1.5 rounded-lg bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            <PlusCircle size={13} /> Add product
          </Link>
          <Link
            href="/seller/products"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Manage products
          </Link>
          <Link
            href="/seller/orders"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            View orders
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  href, label, value, sub, icon: Icon,
}: {
  href: string; label: string; value: number; sub: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="mt-1.5 text-[2rem] font-bold tracking-tight text-neutral-950">{value}</p>
        <p className="mt-0.5 text-[13px] text-neutral-500">{sub}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 transition-colors group-hover:bg-neutral-100">
        <Icon size={20} strokeWidth={1.75} className="text-neutral-700" />
      </div>
    </Link>
  );
}

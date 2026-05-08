'use client';

import Link from 'next/link';
import { Store, Users, Package, TrendingUp, ArrowRight, type LucideIcon } from 'lucide-react';
import { useAdminSellers, useAdminBuyers, useAdminProducts } from '@/hooks/useAdmin';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/lib/auth';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const dateLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});

export default function AdminDashboardPage() {
  const user     = useAuthStore((s) => s.user);
  const { data: sellers }  = useAdminSellers();
  const { data: buyers }   = useAdminBuyers();
  const { data: products } = useAdminProducts();

  const firstName = user?.name?.split(' ')[0] ?? 'Admin';

  const activeSellers  = sellers?.filter((s) => s.isActive).length ?? 0;
  const pendingSellers = sellers?.filter((s) => !s.isActive).length ?? 0;
  const totalGMV       = products?.reduce((sum, p) => sum + Number(p.price) * p.stock, 0) ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="border-b border-neutral-100 pb-6">
        <p className="mb-1 text-[13px] text-neutral-400">{dateLabel}</p>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-neutral-950">
          {greeting()}, {firstName}.
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          href="/admin/sellers"
          label="Sellers"
          value={sellers?.length ?? 0}
          sub={`${activeSellers} active`}
          icon={Store}
          color="blue"
        />
        <StatCard
          href="/admin/buyers"
          label="Buyers"
          value={buyers?.length ?? 0}
          sub="registered accounts"
          icon={Users}
          color="sky"
        />
        <StatCard
          href="/admin/products"
          label="Products"
          value={products?.length ?? 0}
          sub={`${products?.filter((p) => p.isActive).length ?? 0} active`}
          icon={Package}
          color="amber"
        />
        <StatCard
          href="/admin/products"
          label="Inventory GMV"
          value={formatPrice(totalGMV)}
          sub="price × stock"
          icon={TrendingUp}
          color="emerald"
          isText
        />
      </div>

      {/* Sellers needing attention */}
      {pendingSellers > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-amber-800">
                {pendingSellers} inactive seller{pendingSellers !== 1 ? 's' : ''}
              </p>
              <p className="mt-0.5 text-[12px] text-amber-600">
                Review and activate pending seller accounts.
              </p>
            </div>
            <Link
              href="/admin/sellers"
              className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-[12px] font-semibold text-amber-800 transition-colors hover:bg-amber-200"
            >
              Review <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* Recent sellers */}
      <div className="rounded-2xl border border-neutral-100 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="text-[14px] font-semibold text-neutral-900">Sellers</h2>
          <Link
            href="/admin/sellers"
            className="flex items-center gap-1 text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {sellers?.length ? (
          <div className="divide-y divide-neutral-50">
            {sellers.slice(0, 6).map((seller) => (
              <div key={seller.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[11px] font-bold text-neutral-600">
                    {seller.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-neutral-900">{seller.name}</p>
                    <p className="truncate text-[12px] text-neutral-400">
                      {seller.businessName ?? seller.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-neutral-400">
                    {seller.productCount ?? 0} products
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    seller.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {seller.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-[13px] text-neutral-400">No sellers yet.</p>
        )}
      </div>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: '/admin/sellers',    label: 'Manage sellers',    icon: Store },
          { href: '/admin/buyers',     label: 'Manage buyers',     icon: Users },
          { href: '/admin/categories', label: 'Edit categories',   icon: Package },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-4 py-3.5 transition-all hover:border-neutral-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Icon size={14} strokeWidth={1.75} className="text-neutral-500" />
              <span className="text-[13px] font-medium text-neutral-700">{label}</span>
            </div>
            <ArrowRight size={13} className="text-neutral-300" />
          </Link>
        ))}
      </div>

    </div>
  );
}

type CardColor = 'blue' | 'amber' | 'emerald' | 'sky';
const colorMap: Record<CardColor, { bg: string; icon: string }> = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-500' },
};

function StatCard({
  href, label, value, sub, icon: Icon, color = 'blue', isText = false,
}: {
  href: string; label: string; value: number | string; sub: string;
  icon: LucideIcon; color?: CardColor; isText?: boolean;
}) {
  const c = colorMap[color];
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:border-neutral-200 hover:shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon size={13} strokeWidth={1.75} className={c.icon} />
        </div>
      </div>
      <p className={`font-bold leading-none tracking-tight text-neutral-950 ${isText ? 'text-[1.4rem]' : 'text-[2.25rem]'}`}>
        {value}
      </p>
      <p className="mt-2 text-[12px] text-neutral-400">{sub}</p>
    </Link>
  );
}

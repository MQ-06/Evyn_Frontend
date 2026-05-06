'use client';

import Link from 'next/link';
import { Store, Users, Package, ArrowRight, type LucideIcon } from 'lucide-react';
import { useAdminSellers, useAdminBuyers, useAdminProducts } from '@/hooks/useAdmin';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/lib/auth';

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: sellers } = useAdminSellers();
  const { data: buyers }  = useAdminBuyers();
  const { data: products } = useAdminProducts();

  const firstName = user?.name?.split(' ')[0] ?? 'Admin';

  const activeSellers  = sellers?.filter((s) => s.isActive).length ?? 0;
  const activeBuyers   = buyers?.filter((b) => b.isActive).length ?? 0;
  const activeProducts = products?.filter((p) => p.isActive).length ?? 0;

  const totalGMV = products?.reduce((sum, p) => sum + Number(p.price) * p.stock, 0) ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">
          Hello, {firstName} 👋
        </h1>
        <p className="mt-1 text-[14px] text-neutral-500">Admin dashboard</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard href="/admin/sellers" label="Sellers" value={sellers?.length ?? 0}
          sub={`${activeSellers} active`} icon={Store} />
        <StatCard href="/admin/buyers"  label="Buyers"  value={buyers?.length ?? 0}
          sub={`${activeBuyers} active`} icon={Users} />
        <StatCard href="/admin/products" label="Products" value={products?.length ?? 0}
          sub={`${activeProducts} active`} icon={Package} />
        <div className="rounded-2xl border border-neutral-100 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Inventory GMV</p>
          <p className="mt-2 text-[1.5rem] font-bold tracking-tight text-neutral-950">{formatPrice(totalGMV)}</p>
          <p className="mt-0.5 text-[12px] text-neutral-400">price × stock (all products)</p>
        </div>
      </div>

      {/* Recent sellers */}
      {!!sellers?.length && (
        <div className="mb-6 rounded-2xl border border-neutral-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-neutral-900">Recent sellers</h2>
            <Link href="/admin/sellers" className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {sellers.slice(0, 5).map((seller) => (
              <div key={seller.id} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                <div>
                  <p className="text-[13px] font-medium text-neutral-900">{seller.name}</p>
                  <p className="text-[12px] text-neutral-400">{seller.businessName ?? seller.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-neutral-400">{seller.productCount ?? 0} products</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    seller.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {seller.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ href, label, value, sub, icon: Icon }: {
  href: string; label: string; value: number; sub: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-5 transition-shadow hover:shadow-md">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="mt-2 text-[1.75rem] font-bold tracking-tight text-neutral-950">{value}</p>
        <p className="mt-0.5 text-[12px] text-neutral-400">{sub}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 transition-colors group-hover:bg-neutral-100">
        <Icon size={18} strokeWidth={1.75} className="text-neutral-600" />
      </div>
    </Link>
  );
}

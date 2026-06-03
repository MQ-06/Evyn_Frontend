'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { clearRoleCookie, getInitials } from '@/lib/auth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const links = [
  { href: '/seller/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { href: '/seller/products',  label: 'Products',  icon: Package },
  { href: '/seller/orders',    label: 'Orders',    icon: ShoppingBag },
  { href: '/seller/profile',   label: 'Profile',   icon: User },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const initials = user?.name ? getInitials(user.name) : '??';

  async function handleLogout() {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    logout();
    clearRoleCookie();
    toast.success('Signed out');
    router.push('/login');
  }

  return (
    <aside className="hidden w-52 shrink-0 md:block">
      <div className="sticky top-24 flex flex-col">

        {user && (
          <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-13 font-semibold text-neutral-900">{user.name}</p>
                {user.businessName ? (
                  <p className="truncate text-11 text-neutral-400">{user.businessName}</p>
                ) : (
                  <p className="text-11 text-neutral-400 capitalize">{user.role}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nav label */}
        <p className="mb-1.5 px-2 text-10 font-semibold uppercase tracking-widest text-neutral-400">
          Seller portal
        </p>

        {/* Links */}
        <nav className="flex flex-col gap-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-13 font-medium transition-all ${
                  active
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon size={14} strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-13 font-medium text-neutral-400 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sign out
          </button>
        </div>

      </div>
    </aside>
  );
}

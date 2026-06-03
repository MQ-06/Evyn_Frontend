'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { clearRoleCookie } from '@/lib/auth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';

function CartIcon() {
  const { token, user } = useAuthStore();
  const isBuyer = !!token && user?.role === 'buyer';
  const { data: serverCart } = useCart({ enabled: isBuyer });
  const guestItems = useGuestCartStore((s) => s.items);

  const count = isBuyer
    ? (serverCart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0)
    : guestItems.reduce((sum, i) => sum + i.quantity, 0);

  // Sellers and admins don't see cart
  if (token && user?.role !== 'buyer') return null;

  return (
    <Link
      href="/cart"
      className="relative rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
    >
      <ShoppingCart size={15} strokeWidth={1.75} />
      Cart
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-10 font-bold text-white leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  // sidebar handles sign-out on these routes
  const inDashboard = /^\/(seller|buyer|admin)/.test(pathname);

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — clear local state regardless
    }
    logout();
    clearRoleCookie();
    toast.success('Signed out');
    router.push('/login');
  }

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'seller'
        ? '/seller/dashboard'
        : '/buyer/dashboard';

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-neutral-950 select-none"
        >
          Evyn
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/products"
            className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
          >
            Products
          </Link>

          {!token ? (
            <>
              <CartIcon />
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="ml-2 rounded-lg bg-neutral-950 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 active:scale-98"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <CartIcon />
              <Link
                href={dashboardPath}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
              >
                Dashboard
              </Link>
              {!inDashboard && (
                <button
                  onClick={handleLogout}
                  className="ml-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-colors"
                >
                  Sign out
                </button>
              )}
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-md p-1.5 text-neutral-500 hover:bg-neutral-50 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>


      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-neutral-100 bg-white px-5 pb-5 md:hidden">
          <nav className="flex flex-col gap-0.5 pt-3">
            {[
              { href: '/products', label: 'Products' },
              ...(!token
                ? [
                    { href: '/cart',   label: 'Cart' },
                    { href: '/login',  label: 'Sign in' },
                    { href: '/signup', label: 'Get started' },
                  ]
                : [
                    ...(user?.role === 'buyer' ? [{ href: '/cart', label: 'Cart' }] : []),
                    { href: dashboardPath, label: 'Dashboard' },
                  ]),
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {label}
              </Link>
            ))}
            {token && !inDashboard && (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="rounded-md px-2 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

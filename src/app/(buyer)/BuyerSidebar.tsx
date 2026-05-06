'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, User } from 'lucide-react';

const links = [
  { href: '/buyer/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { href: '/buyer/cart',      label: 'Cart',       icon: ShoppingCart },
  { href: '/buyer/orders',    label: 'Orders',     icon: Package },
  { href: '/buyer/profile',   label: 'Profile',    icon: User },
];

export default function BuyerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-48 shrink-0 md:block">
      <nav className="sticky top-24 flex flex-col gap-0.5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          My account
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

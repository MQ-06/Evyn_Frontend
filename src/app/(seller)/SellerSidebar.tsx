'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, User } from 'lucide-react';

const links = [
  { href: '/seller/dashboard', label: 'Overview',  icon: LayoutDashboard },
  { href: '/seller/products',  label: 'Products',  icon: Package },
  { href: '/seller/orders',    label: 'Orders',    icon: ShoppingBag },
  { href: '/seller/profile',   label: 'Profile',   icon: User },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-48 shrink-0 md:block">
      <nav className="sticky top-24 flex flex-col gap-0.5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          Seller portal
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

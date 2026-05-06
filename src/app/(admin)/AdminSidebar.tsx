'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Store, Package, Tag } from 'lucide-react';

const links = [
  { href: '/admin/dashboard',   label: 'Overview',   icon: LayoutDashboard },
  { href: '/admin/sellers',     label: 'Sellers',    icon: Store },
  { href: '/admin/buyers',      label: 'Buyers',     icon: Users },
  { href: '/admin/products',    label: 'Products',   icon: Package },
  { href: '/admin/categories',  label: 'Categories', icon: Tag },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-52 shrink-0">
      <nav className="flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import Link from 'next/link';

const marketplace = [
  { label: 'Browse products', href: '/products' },
  { label: 'Sign in', href: '/login' },
  { label: 'Create account', href: '/signup' },
];

const sellers = [
  { label: 'Seller portal', href: '/seller/dashboard' },
  { label: 'Seller setup', href: '/seller-setup' },
  { label: 'Admin panel', href: '/admin/dashboard' },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950">

      {/* Main grid */}
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <span className="text-base font-bold tracking-tight text-white">Evyn</span>
            <p className="mt-3 max-w-xs text-13 leading-relaxed text-neutral-500">
              A curated multi-vendor marketplace connecting verified sellers with buyers who value quality.
            </p>
          </div>

          {/* Marketplace links */}
          <div>
            <p className="mb-4 text-11 font-semibold uppercase tracking-[0.15em] text-neutral-600">
              Marketplace
            </p>
            <ul className="flex flex-col gap-2.5">
              {marketplace.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-13 text-neutral-400 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers links */}
          <div>
            <p className="mb-4 text-11 font-semibold uppercase tracking-[0.15em] text-neutral-600">
              Sellers
            </p>
            <ul className="flex flex-col gap-2.5">
              {sellers.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-13 text-neutral-400 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row sm:px-8">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Evyn. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
              Privacy
            </Link>
            <Link href="/login" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

import Link from 'next/link';

const links = [
  { label: 'Products', href: '/products' },
  { label: 'Sign in', href: '/login' },
  { label: 'Register', href: '/signup' },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <span className="text-[13px] font-medium text-neutral-950 tracking-tight">Evyn</span>
        <nav className="flex items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-[13px] text-neutral-400">
          &copy; {new Date().getFullYear()} Evyn
        </p>
      </div>
    </footer>
  );
}

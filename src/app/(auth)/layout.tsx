import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, Zap, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: { default: 'Evyn', template: '%s | Evyn' },
};

const features = [
  { icon: ShieldCheck, text: 'Verified sellers only - admin-approved before going live' },
  { icon: Zap,         text: 'Atomic checkout - stock reserved instantly at DB level' },
  { icon: Package,     text: 'Price snapshots - order history always shows what you paid' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">

      {/* ── Left panel (dark brand) ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-neutral-950 p-10 lg:flex lg:w-[45%]">

        {/* Subtle grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top gradient accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-600 opacity-20 blur-3xl"
        />

        {/* Logo */}
        <Link href="/" className="relative text-17 font-bold tracking-tight text-white">
          Evyn
        </Link>

        {/* Tagline */}
        <div className="relative">
          <blockquote className="mb-10">
            <p className="text-[1.6rem] font-bold leading-snug tracking-tight text-white">
              Where independent sellers meet their customers.
            </p>
            <p className="mt-4 text-15 leading-relaxed text-neutral-400">
              A curated marketplace built for verified sellers and discerning buyers.
            </p>
          </blockquote>

          <ul className="flex flex-col gap-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-600/20">
                  <Icon size={13} className="text-brand-400" strokeWidth={2} />
                </div>
                <span className="text-13 leading-snug text-neutral-400">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom caption */}
        <p className="relative text-xs text-neutral-600">
          © {new Date().getFullYear()} Evyn. All rights reserved.
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-1 flex-col bg-white">

        {/* Mobile top bar */}
        <div className="flex h-14 items-center border-b border-neutral-100 px-5 lg:hidden">
          <Link href="/" className="text-15 font-semibold tracking-tight text-neutral-950">
            Evyn
          </Link>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

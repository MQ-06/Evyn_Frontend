import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Evyn', template: '%s | Evyn' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Top bar */}
      <div className="flex h-14 items-center px-5 sm:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-neutral-950 transition-opacity hover:opacity-70"
        >
          Evyn
        </Link>
      </div>

      {/* Centered card area */}
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}

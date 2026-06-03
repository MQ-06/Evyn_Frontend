import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export type CardColor = 'blue' | 'amber' | 'emerald' | 'sky';

const colorMap: Record<CardColor, { bg: string; icon: string }> = {
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-500' },
};

interface StatCardProps {
  href: string;
  label: string;
  value: number | string;
  sub: string;
  icon: LucideIcon;
  color?: CardColor;
  /** When true, renders the value at a smaller size (for text like prices). */
  isText?: boolean;
}

export default function StatCard({
  href, label, value, sub, icon: Icon, color = 'blue', isText = false,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:border-neutral-200 hover:shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-11 font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon size={13} strokeWidth={1.75} className={c.icon} />
        </div>
      </div>
      <p className={`font-bold leading-none tracking-tight text-neutral-950 ${isText ? 'text-2xl' : 'text-4xl'}`}>
        {value}
      </p>
      <p className="mt-2 text-xs text-neutral-400">{sub}</p>
    </Link>
  );
}

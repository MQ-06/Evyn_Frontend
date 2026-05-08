import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100">
        <Icon size={26} strokeWidth={1.5} className="text-brand-400" />
      </div>
      <p className="text-[15px] font-semibold text-neutral-800">{title}</p>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-neutral-400">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-violet-500 px-5 py-2.5 text-sm font-medium text-white shadow-brand-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

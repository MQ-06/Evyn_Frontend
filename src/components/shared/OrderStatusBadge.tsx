import type { OrderStatusType } from '@/types';

const config: Record<OrderStatusType, { label: string; className: string }> = {
  pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped:   { label: 'Shipped',   className: 'bg-violet-50 text-violet-700 border-violet-200' },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-200' },
};

export default function OrderStatusTypeBadge({ status }: { status: OrderStatusType }) {
  const { label, className } = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

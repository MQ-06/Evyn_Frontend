import { formatPrice } from '@/lib/auth';
import { SHIPPING_THRESHOLD } from '@/lib/constants';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  children: React.ReactNode;
}

export default function OrderSummary({ subtotal, shipping, total, children }: OrderSummaryProps) {
  return (
    <div className="w-full lg:w-72 shrink-0">
      <div className="rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Order summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-neutral-400">
              Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} for free shipping
            </p>
          )}
          <div className="border-t border-neutral-100 pt-3">
            <div className="flex justify-between font-semibold text-neutral-950">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

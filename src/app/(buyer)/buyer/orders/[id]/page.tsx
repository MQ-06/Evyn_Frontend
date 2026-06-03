'use client';

import Link from 'next/link';
import { ChevronLeft, MapPin, Truck } from 'lucide-react';
import { useOrder } from '@/hooks/useOrders';
import { formatPrice, formatDate, formatOrderId } from '@/lib/auth';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge';
import OrderDetailSkeleton from '@/components/shared/OrderDetailSkeleton';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return (
    <div className="py-20 text-center text-neutral-400">Order not found.</div>
  );

  return (
    <div>
      {/* Back link */}
      <Link
        href="/buyer/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-13 text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ChevronLeft size={14} /> Orders
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl font-bold text-neutral-950">
            {formatOrderId(order.id)}
          </h1>
          <p className="mt-1 text-13 text-neutral-500">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: items + tracking */}
        <div className="space-y-6 lg:col-span-2">

          {/* Items */}
          <div className="rounded-2xl border border-neutral-100 bg-white">
            <div className="border-b border-neutral-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-neutral-900">Items ordered</h2>
            </div>
            <div className="divide-y divide-neutral-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Qty {item.quantity} · {formatPrice(item.unitPrice)} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-neutral-950">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking note */}
          {order.trackingNote && (
            <div className="flex gap-3 rounded-2xl border border-neutral-100 bg-white p-5">
              <Truck size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-neutral-500" />
              <div>
                <p className="text-13 font-semibold text-neutral-900">Tracking update</p>
                <p className="mt-1 text-13 leading-relaxed text-neutral-600">{order.trackingNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: summary + address */}
        <div className="space-y-6">

          {/* Pricing */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">Summary</h2>
            <div className="space-y-2.5 text-13">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className={order.shippingCost === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2.5 font-semibold text-neutral-950">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.75} className="text-neutral-500" />
              <h2 className="text-sm font-semibold text-neutral-900">Shipping address</h2>
            </div>
            <address className="space-y-0.5 text-13 not-italic text-neutral-600">
              <p className="font-medium text-neutral-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}

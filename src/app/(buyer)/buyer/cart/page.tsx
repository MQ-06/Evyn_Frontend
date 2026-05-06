'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Package, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { getApiError } from '@/lib/utils';
import { formatPrice } from '@/lib/auth';
import { Skeleton } from '@/components/ui/Skeleton';

const SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING = 5;

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  async function handleQty(itemId: string, newQty: number, maxStock: number) {
    if (newQty < 1 || newQty > maxStock) return;
    try {
      await updateItem.mutateAsync({ itemId, quantity: newQty });
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  async function handleRemove(itemId: string) {
    try {
      await removeItem.mutateAsync(itemId);
      toast.success('Item removed');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  if (isLoading) return <CartSkeleton />;

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-8 text-[1.5rem] font-bold tracking-tight text-neutral-950">Cart</h1>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <Package size={36} strokeWidth={1.25} className="mb-4 text-neutral-300" />
          <p className="text-[15px] font-medium text-neutral-500">Your cart is empty</p>
          <p className="mt-1 text-[13px] text-neutral-400">Start browsing to add items</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Browse products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-[1.5rem] font-bold tracking-tight text-neutral-950">
        Cart
        <span className="ml-2 text-[1rem] font-normal text-neutral-400">
          ({cart?.itemCount} {cart?.itemCount === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Items list */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4"
            >
              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {item.product.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package size={20} className="text-neutral-300" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="line-clamp-1 text-[14px] font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.seller?.businessName && (
                      <p className="text-[12px] text-neutral-400">{item.product.seller.businessName}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-[15px] font-bold text-neutral-950">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQty(item.id, item.quantity - 1, item.product.stock)}
                      disabled={item.quantity <= 1 || updateItem.isPending}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-[14px] font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQty(item.id, item.quantity + 1, item.product.stock)}
                      disabled={item.quantity >= item.product.stock || updateItem.isPending}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-[12px] text-neutral-400">
                      @ {formatPrice(item.product.price)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removeItem.isPending}
                    className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6">
            <h2 className="mb-5 text-[14px] font-semibold text-neutral-900">Order summary</h2>

            <div className="space-y-3 text-[14px]">
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
                <p className="text-[12px] text-neutral-400">
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

            <Link
              href="/buyer/checkout"
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Checkout <ArrowRight size={14} />
            </Link>

            <Link
              href="/products"
              className="mt-3 flex h-9 w-full items-center justify-center text-[13px] text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div>
      <Skeleton className="mb-8 h-8 w-24" />
      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4">
              <Skeleton className="h-20 w-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-7 w-32 mt-2" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="hidden h-64 w-72 rounded-2xl lg:block" />
      </div>
    </div>
  );
}

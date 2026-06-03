'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Package, ArrowRight, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { formatPrice } from '@/lib/auth';
import { getApiError } from '@/lib/utils';
import { SHIPPING_THRESHOLD, FLAT_SHIPPING } from '@/lib/constants';
import CheckoutButton from '@/components/cart/CheckoutButton';
import OrderSummary from '@/components/cart/OrderSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import CartSkeleton from '@/components/cart/CartSkeleton';
import api from '@/lib/api';
import type { GuestCartItem } from '@/stores/guest-cart.store';

export default function CartPage() {
  const { user, token } = useAuthStore();
  const { items: guestItems, updateItem: updateGuest, removeItem: removeGuest, clear: clearGuest } = useGuestCartStore();
  const qc = useQueryClient();
  const mergedRef = useRef(false);

  const isLoggedIn = !!token && !!user;
  const isBuyer = isLoggedIn && user.role === 'buyer';

  const { data: serverCart, isLoading: serverLoading } = useCart({ enabled: isBuyer });

  useEffect(() => {
    if (!isBuyer || guestItems.length === 0 || mergedRef.current) return;
    mergedRef.current = true;
    const itemsToMerge = guestItems;
    Promise.all(
      itemsToMerge.map((item) =>
        api.post('/cart', { productId: item.productId, quantity: item.quantity }).catch(() => {})
      )
    ).then(() => {
      clearGuest();
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Your saved items have been added to your cart');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBuyer]);

  if (isLoggedIn && !isBuyer) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <ShoppingCart size={36} strokeWidth={1.25} className="mx-auto mb-4 text-neutral-300" />
        <p className="text-15 font-medium text-neutral-700">Sellers and admins cannot shop on Evyn.</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <GuestCartView items={guestItems} updateItem={updateGuest} removeItem={removeGuest} />;
  }

  return <ServerCartView cart={serverCart} isLoading={serverLoading} />;
}

/* ─── Guest cart ───────────────────────────────────────────────────────────── */

function GuestCartView({
  items,
  updateItem,
  removeItem,
}: {
  items: GuestCartItem[];
  updateItem: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
}) {
  if (items.length === 0) return <EmptyCart />;

  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-neutral-950">
        Cart
        <span className="ml-2 text-base font-normal text-neutral-400">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {item.product.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package size={20} strokeWidth={1.5} className="text-neutral-300" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="line-clamp-1 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
                      {item.product.name}
                    </Link>
                    {item.product.seller?.businessName && (
                      <p className="text-xs text-neutral-400">{item.product.seller.businessName}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-15 font-bold text-neutral-950">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItem(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-xs text-neutral-400">@ {formatPrice(item.product.price)}</span>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrderSummary subtotal={subtotal} shipping={shipping} total={total}>
          <CheckoutButton />
        </OrderSummary>
      </div>
    </div>
  );
}

/* ─── Server (buyer) cart ──────────────────────────────────────────────────── */

function ServerCartView({ cart, isLoading }: { cart: ReturnType<typeof useCart>['data']; isLoading: boolean }) {
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

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-neutral-950">
        Cart
        <span className="ml-2 text-base font-normal text-neutral-400">
          ({cart?.itemCount} {cart?.itemCount === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {item.product.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package size={20} strokeWidth={1.5} className="text-neutral-300" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="line-clamp-1 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
                      {item.product.name}
                    </Link>
                    {item.product.seller?.businessName && (
                      <p className="text-xs text-neutral-400">{item.product.seller.businessName}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-15 font-bold text-neutral-950">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQty(item.id, item.quantity - 1, item.product.stock)}
                      disabled={item.quantity <= 1 || updateItem.isPending}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQty(item.id, item.quantity + 1, item.product.stock)}
                      disabled={item.quantity >= item.product.stock || updateItem.isPending}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-xs text-neutral-400">@ {formatPrice(item.product.price)}</span>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removeItem.isPending}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrderSummary subtotal={subtotal} shipping={shipping} total={total}>
          <Link
            href="/buyer/checkout"
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Checkout <ArrowRight size={14} />
          </Link>
          <Link
            href="/products"
            className="mt-3 flex h-9 w-full items-center justify-center text-13 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            Continue shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { formatPrice } from '@/lib/auth';
import { inputCls } from '@/lib/styles';
import { SHIPPING_THRESHOLD, FLAT_SHIPPING } from '@/lib/constants';
import FormField from '@/components/ui/FormField';
import type { Order } from '@/types';

const schema = z.object({
  fullName:     z.string().min(1, 'Required').max(120),
  phone:        z.string().min(7, 'Enter a valid phone').max(20),
  addressLine1: z.string().min(1, 'Required').max(200),
  addressLine2: z.string().max(200).optional(),
  city:         z.string().min(1, 'Required').max(100),
  state:        z.string().min(1, 'Required').max(100),
  postalCode:   z.string().min(1, 'Required').max(20),
  country:      z.string().min(1, 'Required').max(100),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: cartData } = useCart();

  const subtotal = cartData?.subtotal ?? 0;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.name ?? '',
      phone: user?.phone ?? '',
      country: 'United States',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!cartData?.items.length) {
      toast.error('Your cart is empty');
      return;
    }
    try {
      const { data } = await api.post<Order>('/orders', { shippingAddress: values });
      await qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
      router.push(`/buyer/orders/${data.id}`);
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-neutral-950">Checkout</h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Shipping form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-5" noValidate>
          <div className="rounded-2xl border border-neutral-100 bg-white p-6">
            <h2 className="mb-5 text-sm font-semibold text-neutral-900">Shipping address</h2>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full name" error={errors.fullName?.message}>
                  <input {...register('fullName')} placeholder="Jane Smith" className={inputCls} />
                </FormField>
                <FormField label="Phone" error={errors.phone?.message}>
                  <input {...register('phone')} type="tel" placeholder="+1 555 000 0000" className={inputCls} />
                </FormField>
              </div>

              <FormField label="Address line 1" error={errors.addressLine1?.message}>
                <input {...register('addressLine1')} placeholder="123 Main Street" className={inputCls} />
              </FormField>

              <FormField label="Address line 2" error={errors.addressLine2?.message} required={false}>
                <input {...register('addressLine2')} placeholder="Apt, suite, unit…" className={inputCls} />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="City" error={errors.city?.message}>
                  <input {...register('city')} placeholder="New York" className={inputCls} />
                </FormField>
                <FormField label="State / Province" error={errors.state?.message}>
                  <input {...register('state')} placeholder="NY" className={inputCls} />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Postal code" error={errors.postalCode?.message}>
                  <input {...register('postalCode')} placeholder="10001" className={inputCls} />
                </FormField>
                <FormField label="Country" error={errors.country?.message}>
                  <input {...register('country')} placeholder="United States" className={inputCls} />
                </FormField>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !cartData?.items.length}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isSubmitting
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              : `Place order · ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6">
            <h2 className="mb-5 text-sm font-semibold text-neutral-900">Order summary</h2>

            <div className="space-y-3 text-13">
              {(cartData?.items ?? []).map((item) => (
                <div key={item.id} className="flex justify-between text-neutral-600">
                  <span className="line-clamp-1 flex-1 pr-2">
                    {item.product.name}
                    <span className="text-neutral-400"> ×{item.quantity}</span>
                  </span>
                  <span className="shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}

              <div className="border-t border-neutral-100 pt-3 space-y-2">
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
                <div className="flex justify-between font-semibold text-neutral-950 pt-1 border-t border-neutral-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

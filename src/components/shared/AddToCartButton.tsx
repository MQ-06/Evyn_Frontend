'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const outOfStock = stock === 0;

  // Non-buyers see nothing — sellers/admins don't shop
  if (token && user?.role !== 'buyer') return null;

  async function handleAdd() {
    if (!token) {
      router.push(`/login?next=/products`);
      return;
    }
    setLoading(true);
    try {
      await api.post('/cart', { productId, quantity: 1 });
      setAdded(true);
      toast.success('Added to cart');
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock || loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : added ? (
        <>
          <Check size={15} />
          Added to cart
        </>
      ) : outOfStock ? (
        'Out of stock'
      ) : (
        <>
          <ShoppingCart size={15} />
          {token ? 'Add to cart' : 'Sign in to buy'}
        </>
      )}
    </button>
  );
}

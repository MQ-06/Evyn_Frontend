'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { user, token } = useAuthStore();
  const addGuestItem = useGuestCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;

  // Sellers and admins don't shop
  if (token && user?.role !== 'buyer') return null;

  function showAdded() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  async function handleAdd() {
    // Not logged in → add to guest cart (localStorage)
    if (!token) {
      addGuestItem(product, 1);
      toast.success('Added to cart');
      showAdded();
      return;
    }

    // Logged-in buyer → add to server cart
    setLoading(true);
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      toast.success('Added to cart');
      showAdded();
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
        <><Check size={15} /> Added to cart</>
      ) : outOfStock ? (
        'Out of stock'
      ) : (
        <><ShoppingCart size={15} /> Add to cart</>
      )}
    </button>
  );
}

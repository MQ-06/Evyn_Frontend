'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Cart } from '@/types';

export function useCart({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get<Cart>('/cart');
      return data;
    },
    enabled,
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.patch(`/cart/${itemId}`, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/${itemId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

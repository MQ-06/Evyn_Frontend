'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from '@/types';

export function useSellerProducts() {
  return useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/seller/products');
      return data;
    },
  });
}

export function useToggleProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Product>(`/seller/products/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller-products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/seller/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seller-products'] }),
  });
}

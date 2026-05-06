'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Order, OrderStatus } from '@/types';

export function useSellerOrders() {
  return useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/seller/orders');
      return data;
    },
  });
}

export function useSellerOrder(id: string) {
  return useQuery({
    queryKey: ['seller-orders', id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/account/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, trackingNote }: { id: string; status: OrderStatus; trackingNote?: string }) =>
      api.patch<Order>(`/seller/orders/${id}/status`, { status, trackingNote }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['seller-orders'] });
      qc.invalidateQueries({ queryKey: ['seller-orders', id] });
    },
  });
}

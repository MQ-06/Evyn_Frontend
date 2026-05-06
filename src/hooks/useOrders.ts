'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Order } from '@/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/account/orders');
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/account/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

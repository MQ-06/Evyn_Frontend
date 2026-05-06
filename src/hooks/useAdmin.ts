'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from '@/types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  businessName: string | null;
  isActive: boolean;
  createdAt: string;
  productCount?: number;
  orderCount?: number;
}

export function useAdminSellers() {
  return useQuery({
    queryKey: ['admin-sellers'],
    queryFn: async () => {
      const { data } = await api.get<AdminUser[]>('/admin/users/sellers');
      return data;
    },
  });
}

export function useAdminBuyers() {
  return useQuery({
    queryKey: ['admin-buyers'],
    queryFn: async () => {
      const { data } = await api.get<AdminUser[]>('/admin/users/buyers');
      return data;
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/admin/products');
      return data;
    },
  });
}

export function useToggleSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/sellers/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-sellers'] }),
  });
}

export function useDeleteSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/sellers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-sellers'] }),
  });
}

export function useToggleBuyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/buyers/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-buyers'] }),
  });
}

export function useDeleteBuyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/buyers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-buyers'] }),
  });
}

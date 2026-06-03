'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { inputCls } from '@/lib/styles';
import type { AuthUser } from '@/types';

const profileSchema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters').max(120),
  phone:        z.string().min(7, 'Enter a valid phone number').max(20).or(z.literal('')).optional(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(120).or(z.literal('')).optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileValues  = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function SellerProfilePage() {
  const { user, updateUser } = useAuthStore();

  const {
    register: regP,
    handleSubmit: handleP,
    formState: { errors: errP, isSubmitting: submittingP },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name:         user?.name ?? '',
      phone:        user?.phone ?? '',
      businessName: user?.businessName ?? '',
    },
  });

  async function onProfile(values: ProfileValues) {
    try {
      const { data } = await api.patch<AuthUser>('/account/profile', {
        name:         values.name,
        phone:        values.phone?.trim() || undefined,
        businessName: values.businessName?.trim() || undefined,
      });
      updateUser(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: errPw, isSubmitting: submittingPw },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  async function onPassword(values: PasswordValues) {
    try {
      await api.patch('/account/profile/password', {
        currentPassword: values.currentPassword,
        newPassword:     values.newPassword,
      });
      toast.success('Password changed');
      resetPw();
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Profile</h1>

      {/* Account info */}
      <section className="rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-1 text-15 font-semibold text-neutral-950">Account information</h2>
        <p className="mb-6 text-13 text-neutral-400">{user?.email}</p>

        <form onSubmit={handleP(onProfile)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-13 font-medium text-neutral-700">Full name</label>
              <input {...regP('name')} placeholder="Jane Smith" className={inputCls} />
              {errP.name && <p className="text-xs text-red-500">{errP.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-13 font-medium text-neutral-700">
                Phone <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <input {...regP('phone')} type="tel" placeholder="+1 555 000 0000" className={inputCls} />
              {errP.phone && <p className="text-xs text-red-500">{errP.phone.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-13 font-medium text-neutral-700">
              Business name <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <input {...regP('businessName')} placeholder="e.g. Artisan Goods Co." className={inputCls} />
            {errP.businessName && <p className="text-xs text-red-500">{errP.businessName.message}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submittingP}
              className="flex h-9 items-center gap-2 rounded-lg bg-neutral-950 px-5 text-13 font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {submittingP
                ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : 'Save changes'}
            </button>
          </div>
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-1 text-15 font-semibold text-neutral-950">Security</h2>
        <p className="mb-6 text-13 text-neutral-400">Change your account password.</p>

        <form onSubmit={handlePw(onPassword)} noValidate className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-13 font-medium text-neutral-700">Current password</label>
            <input {...regPw('currentPassword')} type="password" placeholder="••••••••" className={inputCls} autoComplete="current-password" />
            {errPw.currentPassword && <p className="text-xs text-red-500">{errPw.currentPassword.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-13 font-medium text-neutral-700">New password</label>
              <input {...regPw('newPassword')} type="password" placeholder="Min. 8 characters" className={inputCls} autoComplete="new-password" />
              {errPw.newPassword && <p className="text-xs text-red-500">{errPw.newPassword.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-13 font-medium text-neutral-700">Confirm new password</label>
              <input {...regPw('confirmPassword')} type="password" placeholder="Repeat new password" className={inputCls} autoComplete="new-password" />
              {errPw.confirmPassword && <p className="text-xs text-red-500">{errPw.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submittingPw}
              className="flex h-9 items-center gap-2 rounded-lg bg-neutral-950 px-5 text-13 font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {submittingPw
                ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : 'Update password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

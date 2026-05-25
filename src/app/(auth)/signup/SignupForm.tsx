'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { setRoleCookie } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginResponse } from '@/types';

const schema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name is too long'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-100';

export default function SignupForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const payload = { ...values, phone: values.phone?.trim() || undefined };
    try {
      const { data } = await api.post<LoginResponse>('/auth/signup', payload);
      setAuth(data.access_token, data.user);
      setRoleCookie(data.user.role);
      toast.success('Account created! Welcome to Evyn.');
      router.push('/buyer/dashboard');
    } catch (err) {
      toast.error(getApiError(err));
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">
          Create an account
        </h1>
        <p className="mt-1.5 text-[14px] text-neutral-500">
          Join Evyn and start shopping from independent sellers.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[13px] font-medium text-neutral-700">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            {...register('name')}
            className={inputClass}
          />
          {errors.name && (
            <p className="text-[12px] text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            className={inputClass}
          />
          {errors.email && (
            <p className="text-[12px] text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[13px] font-medium text-neutral-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              {...register('password')}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="flex items-center gap-2 text-[13px] font-medium text-neutral-700">
            Phone
            <span className="font-normal text-neutral-400">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            {...register('phone')}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[12px] leading-relaxed text-neutral-400">
        By signing up you agree to our terms of service and privacy policy.
      </p>

      <p className="mt-4 text-center text-[13px] text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-neutral-900 underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

import { Suspense } from 'react';
import LoginForm from './LoginForm';
import AuthFormSkeleton from '@/components/shared/AuthFormSkeleton';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton rows={2} />}>
      <LoginForm />
    </Suspense>
  );
}

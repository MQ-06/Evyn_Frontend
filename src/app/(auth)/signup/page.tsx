import { Suspense } from 'react';
import SignupForm from './SignupForm';
import AuthFormSkeleton from '@/components/shared/AuthFormSkeleton';

export const metadata = { title: 'Create account' };

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton rows={4} />}>
      <SignupForm />
    </Suspense>
  );
}

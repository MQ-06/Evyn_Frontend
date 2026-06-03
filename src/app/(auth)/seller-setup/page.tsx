import { Suspense } from 'react';
import SellerSetupForm from './SellerSetupForm';
import AuthFormSkeleton from '@/components/shared/AuthFormSkeleton';

export const metadata = { title: 'Complete your seller account' };

export default function SellerSetupPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton rows={2} />}>
      <SellerSetupForm />
    </Suspense>
  );
}

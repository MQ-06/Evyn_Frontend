'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CheckoutButton() {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    if (!clicked) {
      setClicked(true);
      return;
    }
    router.push('/login?next=/cart');
  }

  return (
    <div className="mt-6 space-y-2">
      <button
        onClick={handleClick}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
      >
        {clicked ? 'Confirm — sign in to continue' : <>Checkout <ArrowRight size={14} /></>}
      </button>
      {clicked && (
        <p className="text-center text-xs text-neutral-500">
          You need to sign in to place your order.{' '}
          <Link href="/login?next=/cart" className="underline underline-offset-2 hover:text-neutral-800">
            Sign in
          </Link>{' '}
          or{' '}
          <Link href="/signup" className="underline underline-offset-2 hover:text-neutral-800">
            create an account
          </Link>
          — your cart will be saved.
        </p>
      )}
    </div>
  );
}

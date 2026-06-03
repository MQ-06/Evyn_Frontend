import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-5 text-center">
      <p className="text-11 font-semibold uppercase tracking-widest text-neutral-400">404</p>
      <h1 className="mt-3 text-[2rem] font-bold tracking-tight text-neutral-950">Page not found</h1>
      <p className="mt-2 text-15 text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-lg bg-neutral-950 px-6 text-13 font-medium text-white hover:bg-neutral-800 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}

import Navbar from '@/components/layout/Navbar';
import BuyerSidebar from './BuyerSidebar';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-5 py-8 sm:px-8">
        <BuyerSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

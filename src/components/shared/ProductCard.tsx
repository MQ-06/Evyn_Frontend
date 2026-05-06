import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/auth';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const inStock = product.stock > 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={32} className="text-neutral-300" strokeWidth={1.5} />
          </div>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] font-medium text-neutral-500">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            {product.category.name}
          </span>
        )}

        <h3 className="line-clamp-1 text-[15px] font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
          {product.name}
        </h3>

        {product.seller?.businessName && (
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {product.seller.businessName}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <span className="text-[17px] font-bold tracking-tight text-neutral-950">
            {formatPrice(product.price)}
          </span>
          {inStock && product.stock <= 10 && (
            <span className="text-[12px] text-amber-600">
              {product.stock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

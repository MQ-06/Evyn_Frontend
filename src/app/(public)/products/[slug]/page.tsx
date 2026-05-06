import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { serverFetch } from '@/lib/server-api';
import { formatPrice } from '@/lib/auth';
import type { Product } from '@/types';
import AddToCartButton from '@/components/shared/AddToCartButton';
import ImageGallery from './ImageGallery';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = await serverFetch<Product>(`/products/${params.slug}`);
    return {
      title: product.name,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: 'Product not found' };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  let product: Product;
  try {
    product = await serverFetch<Product>(`/products/${params.slug}`);
  } catch {
    notFound();
  }

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-[13px] text-neutral-400">
        <Link href="/products" className="hover:text-neutral-700 transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight size={13} />
            <Link
              href={`/products?categoryId=${product.category.id}`}
              className="hover:text-neutral-700 transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={13} />
        <span className="text-neutral-600">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Image gallery */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Product info */}
        <div className="flex flex-col">
          {/* Category */}
          {product.category && (
            <Link
              href={`/products?categoryId=${product.category.id}`}
              className="mb-3 inline-block text-[12px] font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-neutral-950 sm:text-3xl">
            {product.name}
          </h1>

          {/* Seller */}
          {product.seller && (
            <p className="mt-2 text-[14px] text-neutral-500">
              Sold by{' '}
              <span className="font-medium text-neutral-700">
                {product.seller.businessName ?? product.seller.name}
              </span>
            </p>
          )}

          {/* Price + stock */}
          <div className="mt-6 flex items-end gap-4">
            <span className="text-[2rem] font-bold tracking-tight text-neutral-950">
              {formatPrice(product.price)}
            </span>
            <span
              className={`mb-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                inStock
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Shipping note */}
          <p className="mt-2 text-[13px] text-neutral-400">
            {product.price >= 50
              ? '✓ Free shipping on this order'
              : `Add $${(50 - product.price).toFixed(2)} more for free shipping`}
          </p>

          {/* Add to cart */}
          <div className="mt-7">
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-neutral-100" />

          {/* Description */}
          <div>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
              Description
            </p>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-neutral-600">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

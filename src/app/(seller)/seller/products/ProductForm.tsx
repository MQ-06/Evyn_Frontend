'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { inputCls } from '@/lib/styles';
import type { Category } from '@/types';

const schema = z.object({
  name:        z.string().min(3, 'At least 3 characters').max(120),
  description: z.string().min(1, 'Description is required'),
  price:       z.number({ message: 'Enter a valid price' }).positive('Must be > 0').multipleOf(0.01),
  stock:       z.number({ message: 'Enter a valid number' }).int().min(0),
  categoryId:  z.string().uuid('Select a category'),
  isActive:    z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

interface ProductFormProps {
  categories: Category[];
  defaultValues?: Partial<ProductFormValues>;
  defaultImages?: string[];
  onSubmit: (values: ProductFormValues, images: string[]) => Promise<void>;
  submitLabel: string;
}

export default function ProductForm({
  categories,
  defaultValues,
  defaultImages = [],
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, ...defaultValues },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 6) { toast.error('Maximum 6 images allowed'); return; }

    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post<{ url: string }>('/seller/upload/image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages((prev) => [...prev, data.url]);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleFormSubmit(values: ProductFormValues) {
    await onSubmit(values, images);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">

      {/* Images */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900">
          Images <span className="font-normal text-neutral-400">({images.length}/6)</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-neutral-200">
              <Image src={src} alt={`Image ${i + 1}`} fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {images.length < 6 && (
            <label className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-300 hover:bg-neutral-50 ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
              {uploading
                ? <Loader2 size={18} className="animate-spin" />
                : <><Upload size={18} /><span className="text-11">Upload</span></>}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}

          {images.length === 0 && !uploading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ImageIcon size={14} />
              <span>No images yet — upload up to 6</span>
            </div>
          )}
        </div>
      </div>

      {/* Core fields */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 space-y-5">
        <h2 className="text-sm font-semibold text-neutral-900">Details</h2>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-medium text-neutral-700">Product name</label>
          <input {...register('name')} placeholder="e.g. Handmade ceramic mug" className={inputCls} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-medium text-neutral-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe your product…"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 resize-none"
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        {/* Price + Stock */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-13 font-medium text-neutral-700">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`${inputCls} pl-7`}
              />
            </div>
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-13 font-medium text-neutral-700">Stock quantity</label>
            <input {...register('stock', { valueAsNumber: true })} type="number" min="0" placeholder="0" className={inputCls} />
            {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-13 font-medium text-neutral-700">Category</label>
          <select {...register('categoryId')} className={`${inputCls} cursor-pointer`}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
        </div>

        {/* Active toggle */}
        <label className="flex cursor-pointer items-center gap-3">
          <input {...register('isActive')} type="checkbox" className="accent-neutral-950 h-4 w-4" />
          <span className="text-13 font-medium text-neutral-700">
            List as active (visible to buyers)
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 transition-colors"
      >
        {isSubmitting
          ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          : submitLabel}
      </button>
    </form>
  );
}

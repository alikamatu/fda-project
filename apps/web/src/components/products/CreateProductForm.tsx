'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateProduct } from '@/hooks/useProducts';
import { ProductCategory, ProductsService } from '@/services/products.service';
import { toast } from 'react-hot-toast';

const productSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  cautions: z.string().optional(),
  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
});

type ProductFormData = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const combined = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(combined);

    const newPreviews = combined.map((f) => URL.createObjectURL(f));
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    createProduct.mutate(data, {
      onSuccess: async (product) => {
        if (selectedFiles.length > 0) {
          setIsUploading(true);
          try {
            await ProductsService.uploadProductImages(product.id, selectedFiles);
          } catch {
            toast.error('Product registered but image upload failed.');
          } finally {
            setIsUploading(false);
          }
        }
        toast.success('Product registered successfully!');
        router.push('/manufacturer/products');
      },
      onError: (error) => {
        console.error('Failed to create product:', error);
        toast.error('Failed to register product. Please try again.');
      },
    });
  };

  const isPending = createProduct.isPending || isUploading;

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide the essential information for your new pharmaceutical product.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <Input
          label="Product Name"
          {...register('productName')}
          error={errors.productName?.message}
          placeholder="e.g. Amoxicillin 500mg"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {Object.values(ProductCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Brief description of the product, usage, and key details..."
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            {...register('ingredients')}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="List of ingredients used to make the product"
          />
          {errors.ingredients && (
            <p className="text-sm text-red-600 mt-1">{errors.ingredients.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Cautions <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            {...register('cautions')}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Any cautionary notes (allergies, handling, storage, etc.)"
          />
          {errors.cautions && (
            <p className="text-sm text-red-600 mt-1">{errors.cautions.message}</p>
          )}
        </div>

        {/* Product Images */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Images <span className="text-gray-400 text-xs">(Optional, up to 5)</span>
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length < 5 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-4m0 0V8m0 4h4m-4 0H8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP up to 5 MB each</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isPending}
          >
            {isUploading ? 'Uploading images...' : 'Register Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

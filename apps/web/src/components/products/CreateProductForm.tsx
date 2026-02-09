'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCreateProduct } from '@/hooks/useProducts';
import { ProductCategory } from '@/services/products.service';
import { toast } from 'react-hot-toast';

const productSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  batchNumber: z.string().min(1, 'Batch number is required'),
  expiryDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Expiry date must be in the future',
  }),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, 'Quantity must be at least 1')),
});

type ProductFormData = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        toast.success('Product registered successfully!');
        router.push('/manufacturer/products');
      },
      onError: (error) => {
        console.error('Failed to create product:', error);
        toast.error('Failed to register product. Please try again.');
      },
    });
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Batch Number"
            {...register('batchNumber')}
            error={errors.batchNumber?.message}
            placeholder="e.g. BATCH-001"
            required
          />
          <Input
            label="Quantity"
            type="number"
            {...register('quantity')}
            error={errors.quantity?.message}
            placeholder="e.g. 1000"
            required
            min={1}
          />
        </div>

        <Input
          label="Expiry Date"
          type="date"
          {...register('expiryDate')}
          error={errors.expiryDate?.message}
          required
        />

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
            isLoading={createProduct.isPending}
          >
            Register Product
          </Button>
        </div>
      </form>
    </Card>
  );
}

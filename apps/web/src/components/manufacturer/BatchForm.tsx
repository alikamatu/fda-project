'use client';

import { useState } from 'react';
import { useCreateBatch } from '@/hooks/useBatches';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface BatchFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function BatchForm({ productId, onSuccess }: BatchFormProps) {
  const router = useRouter();
  const createBatchMutation = useCreateBatch();
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    batchNumber: '',
    manufactureDate: '',
    expiryDate: '',
    quantity: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.batchNumber || !formData.manufactureDate || !formData.expiryDate || !formData.quantity) {
      setError('All fields are required');
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    const mfgDate = new Date(formData.manufactureDate);
    const expDate = new Date(formData.expiryDate);

    if (expDate <= mfgDate) {
      setError('Expiry date must be after manufacture date');
      return;
    }

    try {
      await createBatchMutation.mutateAsync({
        productId,
        batchNumber: formData.batchNumber,
        manufactureDate: new Date(formData.manufactureDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        quantity: quantity,
      });

      onSuccess?.();
      router.push(`/manufacturer/products/${productId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Batch Number *
        </label>
        <Input
          type="text"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          placeholder="e.g., BATCH-2025-001"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufacture Date *
          </label>
          <Input
            type="date"
            name="manufactureDate"
            value={formData.manufactureDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date *
          </label>
          <Input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity *
        </label>
        <Input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="e.g., 1000"
          min="1"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Number of unique verification codes to generate
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={createBatchMutation.isPending}>
          {createBatchMutation.isPending ? 'Creating...' : 'Create Batch'}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

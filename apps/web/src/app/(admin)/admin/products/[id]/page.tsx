'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ProductReviewCard } from '@/components/admin/products/ProductReviewCard';
import { AdminProductsService } from '@/services/admin-products.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProductReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = params?.id as string;

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => AdminProductsService.getProduct(productId),
    enabled: !!productId,
  });

  const approveMutation = useMutation({
    mutationFn: AdminProductsService.approveProduct,
    onSuccess: () => {
      toast.success('Product approved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-product', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      router.push('/admin/products');
    },
    onError: () => toast.error('Failed to approve product'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => AdminProductsService.rejectProduct(id),
    onSuccess: () => {
      toast.success('Product rejected');
      queryClient.invalidateQueries({ queryKey: ['admin-product', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      router.push('/admin/products');
    },
    onError: () => toast.error('Failed to reject product'),
  });

  if (isLoading) return <PageContainer title="Loading...">...</PageContainer>;
  if (!product) return <PageContainer title="Error">Product not found</PageContainer>;

  return (
    <PageContainer 
      title="Review Product" 
      actions={<Link href="/admin/products">Back to List</Link>}
    >
      <ProductReviewCard 
        product={product}
        onApprove={() => approveMutation.mutate(productId)}
        onReject={() => rejectMutation.mutate(productId)}
        isProcessing={approveMutation.isPending || rejectMutation.isPending}
      />
    </PageContainer>
  );
}

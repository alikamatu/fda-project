import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductsService, CreateProductDto } from '@/services/products.service';

export function useProducts() {
  return useQuery({
    queryKey: ['manufacturer-products'],
    queryFn: ProductsService.getProducts,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['manufacturer-product', id],
    queryFn: () => ProductsService.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => ProductsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturer-products'] });
      queryClient.invalidateQueries({ queryKey: ['manufacturer-recent-products'] });
    },
  });
}

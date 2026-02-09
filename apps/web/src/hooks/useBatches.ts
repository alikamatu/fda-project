import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchesService, CreateBatchPayload, BatchResponse } from '@/services/batches.service';

export const useBatches = (productId?: string) => {
  return useQuery({
    queryKey: ['batches', productId],
    queryFn: () => batchesService.getBatchesByProduct(productId!),
    enabled: !!productId,
  });
};

export const useBatchDetail = (productId?: string, batchId?: string) => {
  return useQuery({
    queryKey: ['batch', productId, batchId],
    queryFn: () => batchesService.getBatchDetail(productId!, batchId!),
    enabled: !!productId && !!batchId,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatchPayload) => 
      batchesService.createBatch(data.productId, data),
    onSuccess: (data: BatchResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['batches', data.productId],
      });
    },
  });
};

export const useAdminBatches = (status?: string) => {
  return useQuery({
    queryKey: ['admin-batches', status],
    queryFn: () => batchesService.getAllBatches(status),
  });
};

export const useAdminBatchDetail = (batchId?: string) => {
  return useQuery({
    queryKey: ['admin-batch', batchId],
    queryFn: () => batchesService.getAdminBatchDetail(batchId!),
    enabled: !!batchId,
  });
};

export const useManufacturerBatchDetail = (batchId?: string) => {
  return useQuery({
    queryKey: ['manufacturer-batch', batchId],
    queryFn: () => batchesService.getManufacturerBatchDetail(batchId!),
    enabled: !!batchId,
  });
};

export const useVerifyBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { batchId: string; status: string; notes?: string }) =>
      batchesService.verifyBatch(data.batchId, {
        status: data.status,
        notes: data.notes,
      }),
    onSuccess: (data: BatchResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-batches'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-batch', data.id],
      });
    },
  });
};

export const useGenerateBatchQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => 
      batchesService.generateBatchQRCode(batchId),
    onSuccess: (data: BatchResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-batch', data.id],
      });
    },
  });
};

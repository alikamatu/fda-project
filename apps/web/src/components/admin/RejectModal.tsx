'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const rejectSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

type RejectFormData = z.infer<typeof rejectSchema>;

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
  manufacturerName: string;
}

export function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  manufacturerName,
}: RejectModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: '' },
  });

  const onSubmit = (data: RejectFormData) => {
    onConfirm(data.reason);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Reject Manufacturer: ${manufacturerName}`}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          >
            Reject Manufacturer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Please provide a reason for rejecting this manufacturer. This reason will be logged for audit purposes.
        </p>
        <Input
          label="Rejection Reason"
          placeholder="e.g., Incomplete documentation, Invalid registration number"
          {...register('reason')}
          error={errors.reason?.message}
          required
        />
      </div>
    </Modal>
  );
}

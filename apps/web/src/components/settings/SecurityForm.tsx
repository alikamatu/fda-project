'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useChangePassword } from '@/hooks/useSettings';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecurityForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const getPasswordStrength = (password: string): { text: string; color: string } => {
    if (!password) return { text: '', color: '' };
    if (password.length < 8) return { text: 'Too short', color: 'text-red-600' };
    
    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    if (password.length >= 12) strength++;

    if (strength <= 2) return { text: 'Weak', color: 'text-orange-600' };
    if (strength <= 3) return { text: 'Moderate', color: 'text-yellow-600' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const onSubmit = (data: PasswordFormData) => {
    setShowSuccess(false);
    changePassword.mutate(data, {
      onSuccess: () => {
        reset();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      },
    });
  };

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Security</h2>
        <p className="text-xs text-gray-500 mt-0.5">Update your password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="password"
          label="Current Password"
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
          required
          autoComplete="current-password"
        />

        <div>
          <Input
            type="password"
            label="New Password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
            required
            autoComplete="new-password"
          />
          {newPassword && !errors.newPassword && (
            <p className={`mt-1 text-xs ${passwordStrength.color}`}>
              Password strength: {passwordStrength.text}
            </p>
          )}
        </div>

        <Input
          type="password"
          label="Confirm New Password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          required
          autoComplete="new-password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || changePassword.isPending}
            isLoading={changePassword.isPending}
          >
            Change Password
          </Button>
          {showSuccess && (
            <span className="ml-3 text-xs text-green-600">
              Password changed successfully
            </span>
          )}
          {changePassword.isError && (
            <span className="ml-3 text-xs text-red-600">
              {changePassword.error instanceof Error 
                ? changePassword.error.message 
                : 'Failed to change password'}
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

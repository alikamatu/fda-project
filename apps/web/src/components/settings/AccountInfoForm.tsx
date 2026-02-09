'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUpdateProfile } from '@/hooks/useSettings';
import { UserSettings } from '@/types/settings';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface AccountInfoFormProps {
  settings: UserSettings;
}

export function AccountInfoForm({ settings }: AccountInfoFormProps) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: settings.fullName,
      phone: settings.phone || '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate({
      fullName: data.fullName,
      phone: data.phone || undefined,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'info';
      case 'MANUFACTURER':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Account Information</h2>
        <p className="text-xs text-gray-500 mt-0.5">Manage your personal details</p>
      </div>

      {!settings.isActive && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-700 font-medium">
            Your account is currently disabled. Some features may be restricted.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
            required
          />
          <Input
            label="Phone Number"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="Optional"
          />
        </div>

        {/* Read-Only Fields */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Read-Only Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-600">
                {settings.email}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Role
              </label>
              <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md">
                <Badge variant={getRoleBadgeVariant(settings.role)} size="sm">
                  {settings.role}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Account Status
              </label>
              <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md">
                <Badge 
                  variant={settings.isActive ? 'success' : 'error'} 
                  size="sm"
                >
                  {settings.isActive ? 'Active' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Account Created
              </label>
              <div className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-600">
                {formatDate(settings.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || updateProfile.isPending}
            isLoading={updateProfile.isPending}
          >
            Save Changes
          </Button>
          {updateProfile.isSuccess && (
            <span className="ml-3 text-xs text-green-600">
              Profile updated successfully
            </span>
          )}
          {updateProfile.isError && (
            <span className="ml-3 text-xs text-red-600">
              {updateProfile.error instanceof Error 
                ? updateProfile.error.message 
                : 'Failed to update profile'}
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { ManufacturerFields } from './ManufacturerFields';
import { useRegisterUser, useRegisterManufacturer } from '@/hooks/useAuth';
import {
  userRegisterSchema,
  manufacturerRegisterSchema,
  UserRegisterFormData,
  ManufacturerRegisterFormData,
} from '@/schemas/auth.schema';
import { UserRole } from '@/types/auth';
import Link from 'next/link';

const roleOptions = [
  { value: UserRole.CONSUMER, label: 'Consumer' },
  { value: UserRole.MANUFACTURER, label: 'Manufacturer' },
];

export function RegisterForm() {
  const [isManufacturer, setIsManufacturer] = useState(false);
  
  const { 
    mutate: registerUser, 
    isPending: isUserPending, 
    error: userError 
  } = useRegisterUser();
  
  const { 
    mutate: registerManufacturer, 
    isPending: isManufacturerPending, 
    error: manufacturerError 
  } = useRegisterManufacturer();
  
  const isLoading = isUserPending || isManufacturerPending;
  const error = userError || manufacturerError;
  
  const methods = useForm<UserRegisterFormData | ManufacturerRegisterFormData>({
    resolver: zodResolver(isManufacturer ? manufacturerRegisterSchema : userRegisterSchema),
    defaultValues: {
      role: UserRole.CONSUMER,
    },
  });

  const { register, handleSubmit, control, formState: { errors } } = methods;
  
  const selectedRole = useWatch({
    control,
    name: 'role',
    defaultValue: UserRole.CONSUMER,
  });

  useEffect(() => {
    setIsManufacturer(selectedRole === UserRole.MANUFACTURER);
  }, [selectedRole]);

  const onSubmit = (data: UserRegisterFormData | ManufacturerRegisterFormData) => {
    if (isManufacturer) {
      registerManufacturer(data as ManufacturerRegisterFormData);
    } else {
      registerUser(data as UserRegisterFormData);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={error?.message || ''} />
        
        <div className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                label="Full Name"
                autoComplete="name"
                {...register('fullName')}
                error={errors.fullName?.message}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                label="Phone (Optional)"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Select
                label="Account Type"
                options={roleOptions}
                {...register('role')}
                error={errors.role?.message}
                required
              />
            </motion.div>
          </div>

          {/* Manufacturer Fields */}
          <AnimatePresence>
            {isManufacturer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ManufacturerFields 
                  register={register as Parameters<typeof ManufacturerFields>[0]['register']} 
                  errors={errors} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Fields */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                error={errors.password?.message}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Input
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                required
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </motion.div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
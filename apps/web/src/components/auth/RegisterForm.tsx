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
import { useRegisterManufacturer, useRegisterUser } from '@/hooks/useAuth';
import {
  userRegisterSchema,
  manufacturerRegisterSchema,
  UserRegisterFormData,
  ManufacturerRegisterFormData,
} from '@/schemas/auth.schema';
import { UserRole } from '@/types/auth';
import Link from 'next/link';

export function RegisterForm() {
  const [isManufacturer, setIsManufacturer] = useState(true); // defaulting to manufacturer registration
  
  // we need two mutations: one for simple users and one for manufacturers
  const {
    mutate: registerUser,
    isPending: isUserPending,
    error: userError,
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
      role: isManufacturer ? UserRole.MANUFACTURER : UserRole.CONSUMER,
    },
  });

  // keep form role value in sync with the toggle state
  useEffect(() => {
    methods.setValue('role', isManufacturer ? UserRole.MANUFACTURER : UserRole.CONSUMER);
  }, [isManufacturer, methods]);

  const { register, handleSubmit, formState: { errors } } = methods;

  // isManufacturer is managed manually or via any UI toggle; we no longer watch the form value

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
      
        {/* account type selector */}
        <div className="hidden space-x-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition-colors ${isManufacturer ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setIsManufacturer(true)}
          >
            Manufacturer
          </button>
        </div>

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
            
            {/* role is managed via a toggle - keep it in the form but hidden from users */}
            <input type="hidden" value={isManufacturer ? UserRole.MANUFACTURER : UserRole.CONSUMER} {...register('role')} />
          </div>

          {/* Manufacturer Fields */}
          <AnimatePresence>
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
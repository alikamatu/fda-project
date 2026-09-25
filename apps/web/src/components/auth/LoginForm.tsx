'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/schemas/auth.schema';
import Link from 'next/link';

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormError message={error?.message || ''} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
          label="Password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
          required
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-2"
      >
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Signing In...' : 'Sign In'}
        </Button>
      </motion.div>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
}
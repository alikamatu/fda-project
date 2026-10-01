'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { ManufacturerFields } from './ManufacturerFields';
import { useRegisterManufacturer } from '@/hooks/useAuth';
import {
  manufacturerRegisterSchema,
  ManufacturerRegisterFormData,
} from '@/schemas/auth.schema';
import { UserRole } from '@/types/auth';
import Link from 'next/link';

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 3;

  const { 
    mutate: registerManufacturer, 
    isPending: isLoading, 
    error 
  } = useRegisterManufacturer();
  
  const methods = useForm<ManufacturerRegisterFormData>({
    resolver: zodResolver(manufacturerRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      role: UserRole.MANUFACTURER,
    },
  });

  const { register, handleSubmit, trigger, watch, formState: { errors } } = methods;

  const watchedPassword = watch('password') || '';
  const hasMinLength = watchedPassword.length >= 8;
  const hasRequiredChars = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(watchedPassword);

  const handleNext = async () => {
    let fieldsToValidate: (keyof ManufacturerRegisterFormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ['fullName', 'email', 'phone'];
    } else if (step === 2) {
      fieldsToValidate = ['companyName', 'registrationNumber', 'contactEmail', 'contactPhone', 'address'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setDirection(1);
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: ManufacturerRegisterFormData) => {
    registerManufacturer(data);
  };

  // Step transition animations
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.22, ease: 'easeOut' as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -24 : 24,
      opacity: 0,
      transition: { duration: 0.18, ease: 'easeIn' as const },
    }),
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={error?.message || ''} />

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between pb-1 px-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-900 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {step === 1 && 'Representative Profile'}
              {step === 2 && 'Company Credentials'}
              {step === 3 && 'Security & Password'}
            </span>
          </div>

          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const s = idx + 1;
              const isCompleted = s < step;
              const isCurrent = s === step;
              return (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-6 bg-blue-900'
                      : isCompleted
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Hidden Role (always MANUFACTURER) */}
        <input type="hidden" value={UserRole.MANUFACTURER} {...register('role')} />

        {/* Step Contents with smooth slide transition */}
        <div className="relative min-h-[210px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: Representative Information */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3.5"
              >
                <Input
                  label="Official Representative Full Name"
                  placeholder="e.g. Dr. Jane Smith"
                  autoComplete="name"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  required
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Official Work Email"
                    type="email"
                    placeholder="representative@organization.com"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />

                  <Input
                    label="Direct Phone (Optional)"
                    type="tel"
                    placeholder="+1 (555) 012-3456"
                    autoComplete="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: Company Information & FDA Credentials */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <ManufacturerFields 
                  register={register} 
                  errors={errors} 
                />
              </motion.div>
            )}

            {/* STEP 3: Security & Password */}
            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Account Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    {...register('password')}
                    error={errors.password?.message}
                    required
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    }
                  />

                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    required
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded transition-colors"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    }
                  />
                </div>

                {/* Password Strength Checklist */}
                <div className="p-3 bg-slate-50/90 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {hasMinLength ? '✓' : '•'}
                    </span>
                    <span className={hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasRequiredChars ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {hasRequiredChars ? '✓' : '•'}
                    </span>
                    <span className={hasRequiredChars ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                      Must include uppercase, lowercase, and a number
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Controls: Back & Next / Submit */}
        <div className="pt-2 flex items-center gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={isLoading}
              className="px-5 h-11 sm:h-12 text-xs sm:text-sm font-semibold"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          )}

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-11 sm:h-12 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <span>Continue to Next Step</span>
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 h-11 sm:h-12 text-xs sm:text-sm font-semibold tracking-wide"
              isLoading={isLoading}
              loadingText="Creating Manufacturer Account..."
            >
              Submit Manufacturer Registration
            </Button>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-slate-500">
            Already have a manufacturer account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-900 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in to portal
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
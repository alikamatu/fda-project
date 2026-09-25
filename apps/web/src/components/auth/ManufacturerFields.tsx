import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { ManufacturerRegisterFormData } from '@/schemas/auth.schema';

interface ManufacturerFieldsProps {
  register: UseFormRegister<ManufacturerRegisterFormData>;
  errors: FieldErrors<ManufacturerRegisterFormData>;
}

export function ManufacturerFields({ register, errors }: ManufacturerFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Company Information
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Company Name"
            {...register('companyName')}
            error={errors.companyName?.message}
            required
          />
          
          <Input
            label="Registration Number"
            {...register('registrationNumber')}
            error={errors.registrationNumber?.message}
            required
          />
          
          <Input
            label="Contact Email"
            type="email"
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
            required
          />
          
          <Input
            label="Contact Phone"
            {...register('contactPhone')}
            error={errors.contactPhone?.message}
            required
          />
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Address
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
              rows={3}
              {...register('address')}
            />
            {errors.address?.message && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start">
          <svg
            className="w-4 h-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-amber-800">
            Manufacturer accounts require approval before product registration. 
            You will be notified once your account is approved.
          </p>
        </div>
      </div>
    </div>
  );
}
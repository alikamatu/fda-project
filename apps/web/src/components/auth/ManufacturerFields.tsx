import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { ManufacturerRegisterFormData } from '@/schemas/auth.schema';

interface ManufacturerFieldsProps {
  register: UseFormRegister<ManufacturerRegisterFormData>;
  errors: FieldErrors<ManufacturerRegisterFormData>;
}

export function ManufacturerFields({ register, errors }: ManufacturerFieldsProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Company Name"
          placeholder="e.g. Acme Pharmaceuticals Inc."
          {...register('companyName')}
          error={errors.companyName?.message}
          required
        />
        
        <Input
          label="FDA Registration #"
          placeholder="e.g. FDA-REG-2026-9041"
          {...register('registrationNumber')}
          error={errors.registrationNumber?.message}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Corporate Email"
          type="email"
          placeholder="contact@company.com"
          {...register('contactEmail')}
          error={errors.contactEmail?.message}
          required
        />
        
        <Input
          label="Corporate Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          {...register('contactPhone')}
          error={errors.contactPhone?.message}
        />
      </div>
      
      <div>
        <label className="block text-xs sm:text-[13px] font-medium text-slate-700 mb-1.5">
          Registered Facility Address <span className="text-red-500 ml-0.5">*</span>
        </label>
        <textarea
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 placeholder:text-slate-400 resize-none transition-all shadow-2xs"
          rows={2}
          placeholder="Street address, city, state, postal code, and country"
          {...register('address')}
        />
        {errors.address?.message && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Verification Notice */}
      <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
        <svg
          className="w-4 h-4 text-blue-800 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="leading-relaxed text-[12px] text-blue-850">
          Manufacturer accounts require FDA regulatory validation before serial batch issuance. Approval is processed upon verification of submitted credentials.
        </p>
      </div>
    </div>
  );
}
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function ApprovalBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
             <span className="font-medium">Account Pending Approval.</span> Your manufacturer account is currently under review. 
            Product registration and management features will be enabled once your account is approved.
          </p>
          <div className="mt-2">
            <a href="#" className="text-sm font-medium text-yellow-700 underline hover:text-yellow-600">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  disabled?: boolean;
}

function ActionCard({ title, description, icon, href, disabled }: ActionCardProps) {
  const content = (
    <div className={`p-6 flex items-start space-x-4 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 transition-colors cursor-pointer'}`}>
      <div className="flex-shrink-0">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <Card className="overflow-hidden">
        {content}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Link href={href}>
        {content}
      </Link>
    </Card>
  );
}

import { CubeIcon, PlusCircleIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

interface QuickActionsProps {
  isApproved: boolean;
}

export function QuickActions({ isApproved }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <ActionCard
        title="Register New Product"
        description="Add a new pharmaceutical product to the registry."
        icon={<PlusCircleIcon className="h-6 w-6" />}
        href="/manufacturer/products/new"
        disabled={!isApproved}
      />
      <ActionCard
        title="View My Products"
        description="Manage your existing product catalog and batches."
        icon={<CubeIcon className="h-6 w-6" />}
        href="/manufacturer/products"
        disabled={!isApproved}
      />
       <ActionCard
        title="Verification Logs"
        description="View detailed verification history for your products."
        icon={<DocumentCheckIcon className="h-6 w-6" />}
        href="/manufacturer/verifications"
        disabled={!isApproved}
      />
    </div>
  );
}

import { ManufacturerWithUser } from '@/types/manufacturer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EyeIcon } from '@heroicons/react/24/outline';

interface ManufacturerRowProps {
  manufacturer: ManufacturerWithUser;
  onView: (manufacturer: ManufacturerWithUser) => void;
}

export function ManufacturerRow({ manufacturer, onView }: ManufacturerRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysPending = () => {
    const createdAt = new Date(manufacturer.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <td className="px-4 py-3">
        <div>
          <div className="text-xs font-medium text-gray-900">{manufacturer.companyName}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            ID: {manufacturer.id}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-gray-900 font-mono">{manufacturer.registrationNumber}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-gray-600">{manufacturer.contactEmail}</div>
      </td>
      <td className="px-4 py-3">
        {manufacturer.isApproved ? (
          <Badge variant="success" size="sm">
            Approved
          </Badge>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              Pending
            </Badge>
            <span className="text-[10px] text-gray-500">
              {getDaysPending()} day{getDaysPending() !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-gray-500">{formatDate(manufacturer.createdAt)}</div>
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(manufacturer)}
          className="text-xs"
        >
          <EyeIcon className="w-3.5 h-3.5 mr-1.5" />
          View
        </Button>
      </td>
    </tr>
  );
}
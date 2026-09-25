'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface NotificationToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
}

function NotificationToggle({ label, description, enabled, disabled = true }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        className={`
          relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
        `}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}

export function NotificationPreferences() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your notification preferences</p>
        </div>
        <Badge variant="neutral" size="sm">Coming Soon</Badge>
      </div>

      <div className="divide-y divide-gray-100">
        <NotificationToggle
          label="Email Notifications"
          description="Receive email updates about your account activity"
          enabled={true}
          disabled={true}
        />
        <NotificationToggle
          label="System Alerts"
          description="Important security and system notifications"
          enabled={true}
          disabled={true}
        />
        <NotificationToggle
          label="Product Alerts"
          description="Updates about products you've verified"
          enabled={false}
          disabled={true}
        />
      </div>

      <p className="mt-4 text-xs text-gray-400 italic">
        Notification preferences will be available in a future update.
      </p>
    </Card>
  );
}

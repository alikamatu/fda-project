import { ReactNode } from 'react';

type MetricColor = 'blue' | 'green' | 'indigo' | 'purple' | 'red' | 'orange';

interface MetricCardProps {
  title: string;
  value?: number;
  icon: ReactNode;
  isLoading: boolean;
  trend?: {
    value: number;
    label: string;
  };
  difference?: string;
  color?: MetricColor;
  className?: string;
}

/**
 * MetricCard Component
 * Displays a metric with title, value, icon, and optional trend information
 * Used in dashboards and analytics views
 */
export function MetricCard({
  title,
  value,
  icon,
  isLoading,
  trend,
  difference,
  color = 'blue',
  className = '',
}: MetricCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'bg-blue-600',
      trend: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      icon: 'bg-green-600',
      trend: 'text-green-600',
    },
    indigo: {
      bg: 'bg-indigo-100',
      icon: 'bg-indigo-600',
      trend: 'text-indigo-600',
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'bg-purple-600',
      trend: 'text-purple-600',
    },
    red: {
      bg: 'bg-red-100',
      icon: 'bg-red-600',
      trend: 'text-red-600',
    },
    orange: {
      bg: 'bg-orange-100',
      icon: 'bg-orange-600',
      trend: 'text-orange-600',
    },
  };

  const colorConfig = colorClasses[color];

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-5 transition-all duration-200
        hover:shadow-md hover:border-gray-300 ${className}
      `}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </p>

          {isLoading ? (
            <div className="space-y-2">
              <div className="w-24 h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : '0'}
                </p>
                {difference && (
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {difference}
                  </span>
                )}
              </div>

              {trend && (
                <p className={`text-xs font-medium mt-2 ${colorConfig.trend}`}>
                  <span className="mr-1">
                    {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'}
                  </span>
                  {Math.abs(trend.value)}% {trend.label}
                </p>
              )}
            </>
          )}
        </div>

        {/* Icon */}
        <div className={`${colorConfig.bg} rounded-lg p-3 ml-4 flex-shrink-0`}>
          <div className={`${colorConfig.icon} text-white rounded flex items-center justify-center p-2`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

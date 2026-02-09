'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon,
  DocumentCheckIcon,
  CubeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useLogout } from '@/hooks/useAuth';

import { useCurrentUser } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const adminNavigation = [
  { name: 'Dashboard Overview', href: '/admin', icon: HomeIcon },
  { name: 'Verifications', href: '/admin/verifications', icon: DocumentCheckIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Batches', href: '/admin/batches', icon: CubeIcon },
  { name: 'Manufacturers', href: '/admin/manufacturers', icon: BuildingOfficeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardDocumentListIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

const manufacturerNavigation = [
  { name: 'Dashboard', href: '/manufacturer/dashboard', icon: HomeIcon },
  { name: 'My Products', href: '/manufacturer/products', icon: CubeIcon },
  { name: 'Batches', href: '/manufacturer/batches', icon: CubeIcon },
  { name: 'Verifications', href: '/manufacturer/verifications', icon: DocumentCheckIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }, // Reuse settings for now
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { data: user } = useCurrentUser();

  const navigation = user?.role === UserRole.MANUFACTURER 
    ? manufacturerNavigation 
    : adminNavigation;

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <Link 
          href={user?.role === UserRole.MANUFACTURER ? '/manufacturer/dashboard' : '/admin'} 
          className="flex items-center gap-2" 
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">FDA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {user?.role === UserRole.MANUFACTURER ? 'Manufacturer' : 'Admin'}
            </span>
            <span className="text-[10px] text-gray-500">Verification System</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Sidebar">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/admin' && item.href !== '/manufacturer/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`
                group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
                transition-colors
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => logout()}
          className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
          Sign Out
        </button>
        
        {/* System Status */}
        <div className="mt-4 px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-medium text-gray-500">System Active</span>
            </div>
            <span className="text-[10px] text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
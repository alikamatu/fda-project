import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  isLoading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.99]';
  
  const variants = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 shadow-sm hover:shadow focus:ring-blue-900 border border-transparent',
    secondary: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-blue-900',
    outline: 'border border-blue-900 text-blue-900 hover:bg-blue-50/70 focus:ring-blue-900',
    ghost: 'text-gray-700 hover:text-blue-900 hover:bg-blue-50/60 focus:ring-blue-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-600',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 py-2 text-sm gap-2',
    lg: 'h-11 px-5 text-base gap-2.5',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={combinedClassName} 
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin h-4 w-4 text-current flex-shrink-0" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3.5"
            />
            <path 
              className="opacity-90" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

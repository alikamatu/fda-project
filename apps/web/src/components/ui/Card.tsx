import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg
      ${paddingClasses[padding]}
      ${hover ? 'hover:shadow-sm transition-shadow' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-white text-black hover:bg-white/90',
  secondary: 'bg-white/10 text-white hover:bg-white/15',
  outline: 'border border-white/10 bg-transparent text-white hover:bg-white/5',
  ghost: 'bg-transparent text-white hover:bg-white/5',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-4 py-2',
  sm: 'h-9 px-3 py-2 text-sm',
  lg: 'h-12 px-6 py-3 text-base',
};

export function Button({ className, variant = 'default', size = 'default', children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

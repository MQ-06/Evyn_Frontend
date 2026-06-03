import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'gradient' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-950 disabled:bg-neutral-300',
  gradient:
    'bg-gradient-to-r from-brand-600 to-violet-500 text-white hover:opacity-90 shadow-brand-sm hover:shadow-brand focus-visible:ring-brand-500 disabled:opacity-50',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-400',
  outline:
    'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 focus-visible:ring-neutral-400 disabled:text-neutral-400',
  ghost:
    'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400 disabled:text-neutral-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-13',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-15',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed active:scale-98',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

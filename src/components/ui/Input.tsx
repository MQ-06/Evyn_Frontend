import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-13 font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'h-10 w-full rounded-lg border bg-neutral-50 px-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:bg-white focus:ring-2',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

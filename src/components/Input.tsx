import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  className = '',
  ...props
}: InputProps) {
  const hasError = !!error;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-white/90 mb-2">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white/10 backdrop-blur-sm
            border-2 transition-all duration-200
            text-white placeholder-white/40
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
            disabled:opacity-40 disabled:cursor-not-allowed
            ${hasError 
              ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50' 
              : 'border-white/20 focus:border-white/50 focus:ring-white/30'
            }
            ${icon ? 'pl-12' : 'pl-4'}
            ${className}
          `}
          {...props}
        />
      </div>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${hasError ? 'text-red-300' : 'text-white/60'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

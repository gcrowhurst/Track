import type { ReactNode } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

  const variants = {
    primary: 
      'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/40',
    secondary: 
      'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm',
    danger: 
      'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40',
    success: 
      'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

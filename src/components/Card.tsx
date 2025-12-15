import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all ${
        onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}


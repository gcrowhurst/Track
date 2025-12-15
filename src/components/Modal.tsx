import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  buttons?: ReactNode;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
  buttons,
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`${sizes[size]} bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-h-[90vh] overflow-auto border border-white/20`}>
        <div className="sticky top-0 bg-white/5 backdrop-blur-md flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors hover:bg-white/20 p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 text-white">{children}</div>
        {buttons && (
          <div className="bg-white/5 backdrop-blur-md px-6 py-4 flex gap-3 justify-end border-t border-white/20">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
}

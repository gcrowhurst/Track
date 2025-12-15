import { useUIStore } from '../store';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Notification() {
  const notification = useUIStore((state) => state.notification);
  const setNotification = useUIStore((state) => state.setNotification);

  if (!notification) return null;

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <AlertCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
  };

  const colors = {
    success: 'bg-green-900 text-green-100 border-green-700',
    error: 'bg-red-900 text-red-100 border-red-700',
    info: 'bg-blue-900 text-blue-100 border-blue-700',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
      <div
        className={`${colors[notification.type]} border rounded-lg p-4 flex items-center gap-3 max-w-md shadow-lg`}
      >
        {icons[notification.type]}
        <p className="flex-1">{notification.message}</p>
        <button
          onClick={() => setNotification(null)}
          className="hover:opacity-75 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

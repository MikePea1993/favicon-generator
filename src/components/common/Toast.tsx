// src/components/common/Toast.tsx
import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Individual Toast Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => {
        handleRemove();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.persistent, toast.duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const typeStyles = {
    success: "border-green-500/50 bg-green-500/10",
    error: "border-red-500/50 bg-red-500/10",
    warning: "border-yellow-500/50 bg-yellow-500/10",
    info: "border-blue-500/50 bg-blue-500/10",
  };

  const iconStyles = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out mb-4 max-w-sm w-full
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${isRemoving ? "translate-x-full opacity-0" : ""}
      `}
    >
      <div
        className={`
        bg-gray-900/95 backdrop-blur-sm border rounded-xl p-4 shadow-2xl
        ${typeStyles[toast.type]}
      `}
      >
        <div className="flex items-start gap-3">
          <Icon
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[toast.type]}`}
          />

          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-semibold text-white mb-1">{toast.title}</p>
            )}
            <p className="text-sm text-gray-300 leading-relaxed">
              {toast.message}
            </p>

            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

// Toast Provider Component
interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toastData: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toastData,
    };

    setToasts((prevToasts) => {
      const updatedToasts = [newToast, ...prevToasts];

      // Limit the number of toasts
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(0, maxToasts);
      }

      return updatedToasts;
    });
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Convenience hooks for different toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>,
    ) => addToast({ type: "success", message, ...options }),

    error: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>,
    ) => addToast({ type: "error", message, ...options }),

    warning: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>,
    ) => addToast({ type: "warning", message, ...options }),

    info: (
      message: string,
      options?: Partial<Omit<Toast, "id" | "type" | "message">>,
    ) => addToast({ type: "info", message, ...options }),
  };
};

export default ToastItem;

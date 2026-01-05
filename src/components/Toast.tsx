import { useEffect, useState } from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "warning" | "info" | "pending";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  txHash?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (toast.type === "pending") return; // Don't auto-dismiss pending toasts

    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "pending":
        return "⏳";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${isLeaving ? "leaving" : ""}`}>
      <div className="toast-icon">
        {toast.type === "pending" ? (
          <span className="spinner-icon"></span>
        ) : (
          getIcon()
        )}
      </div>
      <div className="toast-content">
        <span className="toast-title">{toast.title}</span>
        {toast.message && <span className="toast-message">{toast.message}</span>}
        {toast.txHash && (
          <a
            className="toast-link"
            href={`https://basescan.org/tx/${toast.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on BaseScan →
          </a>
        )}
      </div>
      <button className="toast-dismiss" onClick={handleDismiss}>
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateToast = (id: string, updates: Partial<ToastMessage>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const success = (title: string, message?: string, txHash?: string) => {
    return addToast({ type: "success", title, message, txHash });
  };

  const error = (title: string, message?: string) => {
    return addToast({ type: "error", title, message, duration: 7000 });
  };

  const pending = (title: string, message?: string) => {
    return addToast({ type: "pending", title, message });
  };

  const info = (title: string, message?: string) => {
    return addToast({ type: "info", title, message });
  };

  const warning = (title: string, message?: string) => {
    return addToast({ type: "warning", title, message });
  };

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    success,
    error,
    pending,
    info,
    warning,
  };
}

import { useEffect } from "react";

export default function Toast({ open, type = "success", message, onClose, timeout = 1800 }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose?.(), timeout);
    return () => clearTimeout(id);
  }, [open, onClose, timeout]);

  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-0 right-0 grid place-items-center px-4">
      <div className={`text-white px-4 py-3 rounded-xl shadow ${type === "error" ? "bg-red-700" : "bg-emerald-700"}`}>
        {message}
      </div>
    </div>
  );
}



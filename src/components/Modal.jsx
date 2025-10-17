import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === "Escape") onClose?.(); }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full" onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}



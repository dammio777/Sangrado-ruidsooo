import { useEffect, useState } from "react";
import { useUI } from "../../lib/store";

export function Toast() {
  const toast = useUI((s) => s.toast);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);
  return (
    <div className={`toast ${visible ? "is-visible" : ""}`} role="status" aria-live="polite">
      <span className="toast__dot" aria-hidden="true" />
      <span>{toast?.text ?? ""}</span>
    </div>
  );
}

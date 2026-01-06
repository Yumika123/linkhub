export const generateId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  // server-side fallback
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // fallback
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

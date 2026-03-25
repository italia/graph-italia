import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useUnsavedChanges = (hasUnsavedChanges: boolean, message: string) => {
  useBlocker(
    () => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(message);
        return !confirmLeave;

      }
      return false;
    }
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message; // Browser-specific requirement
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);
};

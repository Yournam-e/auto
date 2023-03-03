import { useEffect } from "react";

export const useEventListener = (eventType: string, callback: () => void) => {
  useEffect(() => {
    window.addEventListener(eventType, callback);
    return () => window.removeEventListener(eventType, callback);
  }, [callback]);
};

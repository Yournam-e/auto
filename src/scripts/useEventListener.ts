import { useEffect } from "react";

export const useEventListener = (eventType: string, callback: () => void) => {
    useEffect(() => {
    window.removeEventListener(eventType, callback);
    window.addEventListener(eventType, callback);
    return () => window.removeEventListener(eventType, callback);
    }, [callback]);
};
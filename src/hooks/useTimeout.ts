import { useEffect } from "react";
import { usePrevious } from "./usePrevious";

export const useTimeout = (
  callback: () => void,
  delay: number | null,
  deps: unknown[]
) => {
  const savedCallback = usePrevious(callback, deps);

  useEffect(() => {
    if (!!delay && savedCallback) {
      const id = setTimeout(savedCallback.current, delay);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [delay, savedCallback, ...deps]);
};

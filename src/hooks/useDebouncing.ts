import { useState } from "react";
import { useTimeout } from "./useTimeout";

export const useDebouncing = (delay: number, initValue?: boolean) => {
  const [isLoading, setLoading] = useState(!!initValue);
  useTimeout(
    () => {
      if (isLoading) {
        setLoading(false);
      }
    },
    delay,
    [isLoading]
  );
  return { isLoading, setLoading };
};

export const useGameButtonDelay = () => useDebouncing(200);
export const useResultButtonDelay = () => useDebouncing(1000, true);

import { useState } from "react";
import { useTimeout } from "./useTimeout";

export const useDebouncing = (delay: number) => {
  const [isLoading, setLoading] = useState(false);
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

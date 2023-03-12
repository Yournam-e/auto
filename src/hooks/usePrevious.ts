import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: T, deps: unknown[]): { current: T } => {
  const prev = useRef<T>();

  useEffect(() => {
    prev.current = value;
  }, [value, ...deps]);
  return prev as { current: T };
};

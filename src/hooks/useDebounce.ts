import { useEffect, useState } from 'react';

interface useDebounceProps {
  value: string;
  delay: number;
}

export default function useDebounce({ value, delay }: useDebounceProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

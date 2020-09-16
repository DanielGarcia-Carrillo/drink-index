import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      // Only call from localstorage on useEffect to prevent client server mismatch
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T) => {
    setStoredValue(value);

    // Save to local storage in an unblocking way
    window.setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    }, 0);
  };

  return [storedValue, setValue];
}

import { useCallback, useState } from 'react';

export type ReturnTypes<T> = [T, (value: T) => void, () => void];

type StorageType = 'localStorage' | 'sessionStorage';

const getStorage = (storageType: StorageType) =>
  storageType === 'localStorage' ? localStorage : sessionStorage;

function useStorage<T>(
  key: string,
  defaultValue: T,
  storageType: StorageType
): ReturnTypes<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = getStorage(storageType).getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  });

  const setItem = useCallback(
    (newValue: T) => {
      try {
        setValue(newValue);
        getStorage(storageType).setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storageType]
  );

  const removeItem = useCallback(() => {
    try {
      setValue(defaultValue);
      getStorage(storageType).removeItem(key);
    } catch (error) {
      console.error(error);
    }
  }, [defaultValue, key, storageType]);

  return [value, setItem, removeItem];
}

export default useStorage;

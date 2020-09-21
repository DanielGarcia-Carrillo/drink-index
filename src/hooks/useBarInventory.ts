import { useCallback } from 'react';
import getDefaultCategories from '../orm/getDefaultCategories';
import useLocalStorage from './useLocalStorage';

const BAR_INGREDIENTS_KEY = 'bar-ingredients';

export default function useBarInventory() {
  const [selectedCategories, setState] = useLocalStorage<string[]>(
    BAR_INGREDIENTS_KEY,
    getDefaultCategories()
  );

  const setCategory = useCallback(
    (category: string) => {
      setState([...selectedCategories, category].sort());
    },
    [selectedCategories]
  );

  const deleteCategory = useCallback(
    (category: string) => {
      setState(selectedCategories.filter(c => c !== category));
    },
    [selectedCategories]
  );

  return {
    selectedCategories,
    setCategory,
    deleteCategory,
  };
}

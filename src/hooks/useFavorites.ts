import { useCallback } from 'react';
import { getSpecId } from '../orm';
import { FormattedSpec } from '../types';
import useLocalStorage from './useLocalStorage';

const FAVORITES_KEY = 'favorite-specs';

interface Favorite {
  id: string;
}

export default function useFavorites() {
  const [favorites, setState] = useLocalStorage<Favorite[]>(FAVORITES_KEY, []);

  const setFavorite = useCallback(
    (spec: FormattedSpec) => {
      setState([
        ...favorites,
        {
          id: getSpecId(spec),
        },
      ]);
    },
    [favorites]
  );

  const deleteFavorite = useCallback(
    (spec: FormattedSpec) => {
      setState(favorites.filter(f => f.id !== getSpecId(spec)));
    },
    [favorites]
  );

  return {
    favorites,
    setFavorite,
    deleteFavorite,
  };
}

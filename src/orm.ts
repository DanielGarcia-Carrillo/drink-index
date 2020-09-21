import specData from '../data/json/normalized-specs-2.json';
import ingredientData from '../data/json/ingredients-1.json';
import type {
  Ingredient,
  FormattedSpec,
  RawSpec,
  AnnotatedIngredient,
} from './types';
import { Inclusion } from './components/searchbar';

const EASY_TO_GET = ['Syrup', 'Sugar', 'Juice', 'Fruit', 'Beer'];

const specs: RawSpec[] = specData;

const ingredientCategories = Array.from(
  new Set(ingredientData.map(i => i.category))
).sort();

function getIngredient<T extends Ingredient>(
  id: number,
  map: Map<number, T>
): T {
  const ingredient = map.get(id);
  if (!ingredient) {
    throw new Error('Missing ingredient');
  }

  return ingredient;
}

export function getAllIngredientCategories(): string[] {
  return ingredientCategories;
}

function getAnnotatedIngredients(
  selectedCategories: string[]
): Map<number, AnnotatedIngredient> {
  const selectedSet = new Set(selectedCategories);

  return new Map(
    ingredientData.map(i => [
      i.id,
      {
        ...i,
        missing: !selectedSet.has(i.category),
      },
    ])
  );
}

function getAnnotatedSpecs(
  selectedCategories: string[],
  ingredientPredicate: (i: AnnotatedIngredient[]) => boolean
): FormattedSpec[] {
  const annotatedIngredientMap = getAnnotatedIngredients(selectedCategories);

  return specs
    .map(s => ({
      ...s,
      ingredients: s.ingredients.map(i =>
        getIngredient(i.ingredientId, annotatedIngredientMap)
      ),
    }))
    .filter(s => ingredientPredicate(s.ingredients));
}

export function getAllSpecsAnnotated(
  selectedCategories: string[]
): FormattedSpec[] {
  return getAnnotatedSpecs(selectedCategories, () => true);
}

export function getAvailableSpecsAnnotated(
  selectedCategories: string[],
  inclusion: Inclusion
): FormattedSpec[] {
  return getAnnotatedSpecs(selectedCategories, ingredients =>
    ingredients.every(
      ({ missing, category }) =>
        !missing ||
        (inclusion === Inclusion.Easy &&
          EASY_TO_GET.some(i => category.includes(i)))
    )
  );
}

import specData from '../../data/json/normalized-specs-2.json';
import ingredientData from '../../data/json/ingredients-1.json';
import type {
  Ingredient,
  FormattedSpec,
  RawSpec,
  AnnotatedIngredient,
} from '../types';
import { Inclusion } from '../components/filter-bar';

const EASY_TO_GET = ['Syrup', 'Sugar', 'Juice', 'Fruit', 'Beer'];

const specs: RawSpec[] = specData;

const categoriesSet = new Set(ingredientData.map(i => i.category));
const ingredientCategories = Array.from(categoriesSet).sort();

const sources = Array.from(new Set(specs.map(s => s.origin))).sort();

function ingredientToCategory(ingredients: typeof ingredientData) {
  return Object.fromEntries(ingredients.map(i => [i.id, i.category]));
}

export function getSpecId(spec: RawSpec | FormattedSpec) {
  return `${spec.name}--${spec.origin}`;
}

let categoryIndex: Record<string, number>;
let categoryMap: Record<number, string>;
export function getCategoryCounts(): Record<string, number> {
  if (categoryIndex) {
    return categoryIndex;
  }

  categoryMap = ingredientToCategory(ingredientData);
  categoryIndex = specs
    .flatMap(s => s.ingredients.map(i => categoryMap[i.ingredientId]))
    .reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return categoryIndex;
}

export function getIncrementalCategoryCounts(
  selectedCategories: string[]
): Record<string, number> {
  const selectedSet = new Set(selectedCategories);

  if (!categoryMap) {
    categoryMap = ingredientToCategory(ingredientData);
  }

  const categoryCounts: Record<string, number> = {};

  specs.forEach(s => {
    const categories = s.ingredients.map(i => categoryMap[i.ingredientId]);
    const missingCategories = categories.filter(c => !selectedSet.has(c));

    if (missingCategories.length === 0) {
      // Removal of any one of these specs will cause this 1 spec to be unavailable
      categories.forEach(c => {
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
      });
    } else if (missingCategories.length === 1) {
      // Missing 1 means, addition of this category will complete the spec
      const category = missingCategories[0];
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });

  return categoryCounts;
}

export function getInvalidCategories(categories: string[]): string[] {
  return categories.filter(c => !categoriesSet.has(c));
}

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

export function getSources() {
  return sources;
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
        missing: !selectedSet.has(i.category) || i.isInfusion,
      },
    ])
  );
}

function getAnnotatedSpecs(
  selectedCategories: string[],
  ingredientFilter: (i: AnnotatedIngredient[]) => boolean
): FormattedSpec[] {
  const annotatedIngredientMap = getAnnotatedIngredients(selectedCategories);

  return specs
    .map(s => ({
      ...s,
      ingredients: s.ingredients.map(i =>
        getIngredient(i.ingredientId, annotatedIngredientMap)
      ),
    }))
    .filter(s => ingredientFilter(s.ingredients))
    .sort(({ name: a }, { name: b }) => a.localeCompare(b));
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

function makeRegexSafe(str: string): string {
  return str.replace(/[^a-z0-9 ]/gi, '\\$&');
}

export function filterSpecs(specs: FormattedSpec[], keywords: string[]) {
  const keywordRegex = keywords.map(k => new RegExp(makeRegexSafe(k), 'i'));
  return specs.filter(spec => {
    const specString = JSON.stringify([
      spec.name,
      spec.origin,
      spec.ingredients.map(i => [i.name, i.category]),
    ]);
    return keywordRegex.every(r => r.test(specString));
  });
}

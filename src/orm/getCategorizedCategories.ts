import { getAllIngredientCategories } from './';

function setDifference(a: string[], b: string[]) {
  const bSet = new Set(b);

  return a.filter(i => !bSet.has(i));
}

const CATEGORY_REGEX = {
  Agave: /^Agave/,
  Gin: /^Gin/,
  Rum: /^Rum/,
  Whiskey: /^Whiske?y/,
  'Other Liquor': /^(?:Vodka|Absinthe|Brandy)/,
  Wine: /^(?:Wine|Vermouth|Sherry|Port|Madeira)/,
  Bitters: /^Bitters/,
  Fruit: /^Fruit/,
  Juice: /^Juice/,
  Liqueur: /^(?:Liqueur|Amaro|Aperitif|Cordial)/,
  Spices: /^Spice/,
  'Syrups / Sweeteners': /^(?:Syrup|Sugar)/,
  Misc: /.*?/,
};

export default function getCategorizedCategories(): Record<string, string[]> {
  let categories = getAllIngredientCategories();

  return Object.fromEntries(
    Object.entries(CATEGORY_REGEX).map(([k, regex]) => {
      const category = categories.filter(c => regex.test(c));
      categories = setDifference(categories, category);
      return [k, category];
    })
  );
}

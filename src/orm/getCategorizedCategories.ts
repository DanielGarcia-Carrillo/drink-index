import { getAllIngredientCategories } from './';

function setDifference(a: string[], b: string[]) {
  const bSet = new Set(b);

  return a.filter(i => !bSet.has(i));
}

const CATEGORY_REGEX = {
  Agave: /^Agave/,
  Gin: /^Gin/,
  Rum: /^(?:Rum|Cachaça)/,
  Whiskey: /^Whiske?y/,
  'Other Liquor': /^(?:Vodka|Absinthe|Brandy)/,
  Wine: /^(?:Wine|Vermouth|Sherry|Port|Madeira)/,
  'Beer / Cider': /^(?:Beer|Cider)/,
  Liqueur: /^(?:Liqueur|Amaro|Aperitif|Cordial)/,
  Bitters: /^Bitters/,
  'Fruit / Vegetable': /^(?:Fruit|Puree|Leaf|Twist|Vegetable)/,
  Juice: /^Juice/,
  Spices: /^Spice/,
  'Syrups / Sweeteners': /^(?:Syrup|Sugar|Molasses)/,
  'Dairy / Mylk': /^(?:Butter|Cream|Milk)/,
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

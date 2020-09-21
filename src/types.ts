export interface Ingredient {
  id: number;
  isInfusion: boolean;
  name: string;
  category: string;
  rumCategory: number | null;
}

interface IngredientReference {
  type: 'SINGLE' | 'CHOICE';
  ingredientId: Ingredient['id'];
}

interface Spec {
  name: string;
  origin: "Smuggler's Cove" | 'Death & Co';
  pageNum: string;
  ingredients: Record<string, any>[];
  originNotes: string | null;
}

export interface RawSpec extends Spec {
  ingredients: IngredientReference[];
}

interface Annotations {
  missing: boolean;
}

export type AnnotatedIngredient = Annotations & Ingredient;

export interface FormattedSpec extends Spec {
  ingredients: AnnotatedIngredient[];
}

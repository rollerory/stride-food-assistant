// Suggestion for autocomplete
export type Suggestion = {
    id: number;
    title: string;
};

// Recipe from history
export type Recipe = {
    id: number;
    title: string;
};

// Individual ingredient with nutrients
export interface Ingredient {
    id?: number;
    name: string;
    amount?: number;
    unit?: string;
    nutrients?: Nutrient[];
}

// Nutrient information
export interface Nutrient {
    name: string;
    amount: number;
}

// Full recipe details from API
export interface RecipeDetails {
    id: number;
    title: string;
    nutrition?: {
        ingredients: Ingredient[];
    };
}

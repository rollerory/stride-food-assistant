// Suggestion for autocomplete
export type Suggestion = {
    id: number;
    title: string;
};

export type RecipePreview = {
    title?: string;
    image?: string;
};

// Recipe from history
export type Recipe = {
    id: number;
    title: string;
};

export interface SavedRecipe {
    id: string;
    recipe_id: number;
    recipe_name: string | null;
    recipe_fats: number[] | null;
}

export interface SearchHistoryEntry {
    query: string;
    recipe_id: number | null;
    searched_at: string;
}

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
    analyzedInstructions?: {
        steps: { step: string }[];
    }[];
}

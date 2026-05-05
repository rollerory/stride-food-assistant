import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Suggestion, Recipe, Ingredient, RecipeDetails } from "@/types";

type SelectedRecipeDetails = Pick<RecipeDetails, "title">;

interface RecipeState {
    // autocomplete
    suggestions: Suggestion[];
    autocompleteCache: Record<string, Suggestion[]>;

    // search flow
    recipeId: number | null;
    recipeDetails: SelectedRecipeDetails | null;
    ingredients: Ingredient[];

    // history
    lastRecipes: Recipe[];

    // system state
    loading: boolean;
    error: string | null;
}

const initialState: RecipeState = {
    suggestions: [],
    autocompleteCache: {},

    recipeId: null,
    recipeDetails: null,
    ingredients: [],

    lastRecipes: [],

    loading: false,
    error: null,
};

const recipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: {
        setSuggestions(state, action: PayloadAction<Suggestion[]>) {
            state.suggestions = action.payload;
        },

        cacheSuggestions(state, action: PayloadAction<{ query: string; data: Suggestion[] }>) {
            state.autocompleteCache[action.payload.query] = action.payload.data;
        },

        setRecipe(state, action: PayloadAction<{ id: number; details: SelectedRecipeDetails }>) {
            state.recipeId = action.payload.id;
            state.recipeDetails = action.payload.details;
        },

        setIngredients(state, action: PayloadAction<Ingredient[]>) {
            state.ingredients = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setLastRecipes(state, action: PayloadAction<Recipe[]>) {
            state.lastRecipes = action.payload;
        },

        addToHistory(state, action: PayloadAction<Recipe>) {
            const max = 5;
            const existingIndex = state.lastRecipes.findIndex(r => r.id === action.payload.id);

            if (existingIndex !== -1) {
                const reordered = [
                    action.payload,
                    ...state.lastRecipes.filter((_, i) => i !== existingIndex)
                ];
                state.lastRecipes = reordered.slice(0, max);
            } else {
                state.lastRecipes = [...state.lastRecipes, action.payload].slice(-5);
            }
        }
    },
});

export const {
    setSuggestions,
    cacheSuggestions,
    setRecipe,
    setIngredients,
    setError,
    setLoading,
    setLastRecipes,
    addToHistory,
} = recipeSlice.actions;

export default recipeSlice.reducer;

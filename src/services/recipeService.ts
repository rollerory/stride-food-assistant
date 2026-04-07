import { Suggestion, Recipe, Ingredient, RecipeDetails } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '72414319173e4b9788784818318c60de';
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Fetch autocomplete suggestions for recipe search
 */
export async function fetchSuggestions(query: string): Promise<Suggestion[]> {
    if (query.trim().length < 2) {
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}/recipes/autocomplete?number=5&query=${encodeURIComponent(query)}&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        throw error;
    }
}

/**
 * Fetch detailed recipe information including nutrients
 */
export async function fetchRecipeDetails(recipeId: number): Promise<Ingredient[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const recipe: RecipeDetails = await response.json();
        return recipe.nutrition?.ingredients || [];
    } catch (error) {
        console.error('Failed to fetch recipe details:', error);
        throw error;
    }
}

import { Suggestion, Ingredient, RecipeDetails, SavedRecipe, SearchHistoryEntry } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/services/authService';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '72414319173e4b9788784818318c60de';
const BASE_URL = 'https://api.spoonacular.com';

async function getAuthenticatedUserId(): Promise<number | string> {
    const user = await authService.getCurrentUser();

    if (!user) {
        throw new Error('Not authenticated');
    }

    return user.id;
}

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

/**
 * Save recipe to user's collection
 */
export async function saveRecipe(recipeData: RecipeDetails) {
    const supabase = createClient();
    const userId = await getAuthenticatedUserId();
    
    const { data, error } = await supabase
        .from('saved_recipes')
        .insert({ 
            user_id: userId, 
            recipe_data: recipeData 
        })
        .select();
    
    if (error) throw error;
    return data;
}

/**
 * Get all saved recipes for current user
 */
export async function getSavedRecipes(): Promise<SavedRecipe[]> {
    const supabase = createClient();
    const userId = await getAuthenticatedUserId();
    
    const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });
    
    if (error) throw error;
    return data ?? [];
}

/**
 * Delete saved recipe
 */
export async function deleteSavedRecipe(recipeId: string) {
    const supabase = createClient();
    const userId = await getAuthenticatedUserId();
    
    const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', userId);
    
    if (error) throw error;
}

/**
 * Add recipe to search history
 */
export async function addSearchToHistory(title: string, recipeId: number) {
    const supabase = createClient();
    const user = await authService.getCurrentUser();

    if (!user) return;

    await supabase
        .from('search_history')
        .insert({
            user_id: user.id,
            query: title,
            recipe_id: recipeId,
        });
}

/**
 * Get search history for current user
 */
export async function getSearchHistory(): Promise<SearchHistoryEntry[]> {
    const supabase = createClient();
    const userId = await getAuthenticatedUserId();

    const { data, error } = await supabase
        .from('search_history')
        .select('query, recipe_id, searched_at')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(5);

    if (error) throw error;
    return data ?? [];
}

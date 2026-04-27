import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
  getSearchHistory,
} from '@/services/recipeService';
import type { RecipeDetails, SavedRecipe, SearchHistoryEntry } from '@/types';

/**
 * Hook для роботи з збереженими рецептами
 */
export function useSavedRecipes() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await getSavedRecipes();
      setRecipes(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchRecipes();
  }, [fetchRecipes]);

  const addRecipe = async (recipeData: RecipeDetails) => {
    try {
      await saveRecipe(recipeData);
      await fetchRecipes();
      return true;
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  const removeRecipe = async (recipeId: string) => {
    try {
      await deleteSavedRecipe(recipeId);
      await fetchRecipes();
      return true;
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  return {
    recipes,
    loading,
    error,
    addRecipe,
    removeRecipe,
    refetch: fetchRecipes,
  };
}

/**
 * Hook для роботи з історією пошуків
 */
export function useSearchHistory() {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await getSearchHistory();
      setHistory(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
}

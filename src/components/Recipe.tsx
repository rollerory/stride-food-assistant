"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import loaderIcon from '@assets/icons/loader.svg'
import { useDispatch, useSelector } from "react-redux"
import styles from '@/styles/components/meal.module.scss'
import RecipeSearchInput from './RecipeSearchInput'
import Ingredients from './Ingredients'
import { 
    setSuggestions, 
    setRecipe, 
    setIngredients, 
    setLoading, 
    setError, 
    addToHistory 
} from '@/store/recipe'
import { fetchSuggestions, fetchRecipeDetails } from '@/services/recipeService'
import { Suggestion, Recipe, Ingredient } from '@/types'
import RecipeActions from "./RecipeActions"

interface RootState {
    recipe: {
        suggestions: Suggestion[]
        recipeDetails: any
        ingredients: Ingredient[]
        loading: boolean
        error: string | null
        lastRecipes: Recipe[]
    }
}

export default function RecipeSearch() {
    const dispatch = useDispatch()
    const { suggestions, ingredients, loading, error, lastRecipes } = useSelector((state: RootState) => state.recipe)
    
    const [search, setSearch] = useState<string>("")
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [showHistory, setShowHistory] = useState<boolean>(false)
    const [ingredientsLoading, setIngredientsLoading] = useState<boolean>(false)
    const [recipeId, setRecipeId] = useState<number>(0)

    // Load last recipes from localStorage on mount
    useEffect(() => {
        const storedRecipes = localStorage.getItem('lastRecipes')
        if (storedRecipes) {
            try {
                const recipes = JSON.parse(storedRecipes)
                // Sync Redux with localStorage
                recipes.forEach((recipe: Recipe) => dispatch(addToHistory(recipe)))
            } catch (err) {
                console.error('Failed to parse stored recipes:', err)
            }
        }
    }, [dispatch])

    // Fetch autocomplete suggestions when search changes
    useEffect(() => {
        // Don't show suggestions if a recipe is already selected
        if (recipeId !== 0) {
            setShowSuggestions(false)
            return
        }

        if (search.trim().length < 2) {
            dispatch(setSuggestions([]))
            setShowSuggestions(false)
            return
        }

        const fetchSuggests = async () => {
            dispatch(setLoading(true))
            dispatch(setError(null))

            try {
                const data = await fetchSuggestions(search)
                dispatch(setSuggestions(data))
                setShowSuggestions(true)
            } catch (err) {
                dispatch(setError("Failed to fetch suggestions"))
            } finally {
                dispatch(setLoading(false))
            }
        }

        const timeout = setTimeout(fetchSuggests, 400)
        return () => clearTimeout(timeout)
    }, [search, dispatch, recipeId])

    // Handle recipe selection and fetch details
    const handleSelectRecipe = async (title: string, id: number) => {
        setShowSuggestions(false)
        setSearch(title)
        setRecipeId(id)
        dispatch(setSuggestions([]))
        
        try {
            setIngredientsLoading(true)
            const fetchedIngredients = await fetchRecipeDetails(id)
            
            dispatch(setRecipe({ id, details: { title } }))
            dispatch(setIngredients(fetchedIngredients))
            dispatch(addToHistory({ id, title }))
            
            // Persist to localStorage
            const updated = [
                { id, title },
                ...lastRecipes.filter(r => r.id !== id)
            ].slice(0, 5)
            
            localStorage.setItem('lastRecipes', JSON.stringify(updated))
        } catch (err) {
            console.error(err)
            dispatch(setError("Failed to fetch recipe details"))
        } finally {
            setIngredientsLoading(false)
        }
    }

    const handleClear = () => {
        setSearch('')
        dispatch(setIngredients([]))
        setRecipeId(0)
    }

    return (
        <div>
            <div className={styles.meal}>
                <label className={styles.meal__label}>Enter dish name:</label>

                <RecipeSearchInput
                    search={search}
                    onChange={(v) => {
                        setSearch(v)
                        setRecipeId(0) // Reset recipe selection when search text changes
                    }}
                    onClear={handleClear}
                    onToggleHistory={() => setShowHistory(!showHistory)}
                    suggestions={suggestions}
                    showSuggestions={showSuggestions}
                    onSelectSuggestion={handleSelectRecipe}
                    lastRecipes={lastRecipes}
                    showHistory={showHistory}
                    onSelectHistory={(title, id) => {
                        handleSelectRecipe(title, id)
                        setShowHistory(false)
                    }}
                />

                {loading && <p>Loading...</p>}
                {error && <p className={styles.error}>{error}</p>}

                {ingredientsLoading && <div><Image src={loaderIcon} width={24} height={24} alt="Loading..." /></div>}

                {recipeId !== 0 && ingredients.length > 0 && (
                    <Ingredients ingredients={ingredients} />
                )}
                {recipeId !== 0 && ingredients.length > 0 && (
                <RecipeActions />
                )}
            </div>
        </div>
    )
}
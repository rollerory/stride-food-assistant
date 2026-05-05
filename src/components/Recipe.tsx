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
    setLastRecipes,
} from '@/store/recipe'
import type { RootState } from '@/store/store'
import { fetchSuggestions, fetchRecipeDetails, addSearchToHistory, getSearchHistory } from '@/services/recipeService'
import { useAuth } from '@/context/AuthContext'
import RecipeActions from "./RecipeActions"

export default function RecipeSearch() {
    const dispatch = useDispatch()
    const { suggestions, ingredients, loading, error, lastRecipes } = useSelector((state: RootState) => state.recipe)
    const { isAuthenticated } = useAuth()

    const [search, setSearch] = useState<string>("")
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [showHistory, setShowHistory] = useState<boolean>(false)
    const [ingredientsLoading, setIngredientsLoading] = useState<boolean>(false)
    const [recipeId, setRecipeId] = useState<number>(0)

    // Load history from Supabase on mount (only for authenticated users)
    useEffect(() => {
        if (!isAuthenticated) return

        const loadHistory = async () => {
            try {
                const data = await getSearchHistory()
                const recipes = data
                    .filter(entry => entry.recipe_id !== null)
                    .map(entry => ({ id: entry.recipe_id as number, title: entry.query }))
                    .filter((r, i, self) => self.findIndex(x => x.id === r.id) === i)
                dispatch(setLastRecipes(recipes))
            } catch (err) {
                console.error('Failed to load search history:', err)
            }
        }

        void loadHistory()
    }, [isAuthenticated, dispatch])

    // Fetch autocomplete suggestions when search changes
    useEffect(() => {
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
            } catch {
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
            setIngredientsLoading(false)
            await new Promise(r => setTimeout(r, 0))
            dispatch(setIngredients(fetchedIngredients))

            if (isAuthenticated) {
                await addSearchToHistory(title, id)
                const data = await getSearchHistory()
                const recipes = data
                    .filter(entry => entry.recipe_id !== null)
                    .map(entry => ({ id: entry.recipe_id as number, title: entry.query }))
                    .filter((r, i, self) => self.findIndex(x => x.id === r.id) === i)
                dispatch(setLastRecipes(recipes))
            }
        } catch (err) {
            console.error(err)
            dispatch(setError("Failed to fetch recipe details"))
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
            <div className={styles.panel}>
                <h3 className={styles.label}>Enter dish name:</h3>

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

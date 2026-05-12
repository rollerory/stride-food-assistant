"use client"

import { useEffect, useState } from 'react'
import { fetchRecipeDetails } from '@/services/recipeService'
import { Ingredient } from '@/types'
import styles from '@/styles/components/saved.module.scss'
import Ingredients from './Ingredients'

type Props = {
    recipeId: number
    recipeName: string | null
    onClose: () => void
}

export default function RecipeModal({ recipeId, recipeName, onClose }: Props) {
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [steps, setSteps] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        fetchRecipeDetails(recipeId)
            .then(({ ingredients, instructions }) => {
                setIngredients(ingredients)
                setSteps(instructions)
            })
            .catch(() => setError('Failed to load recipe'))
            .finally(() => setLoading(false))
    }, [recipeId])

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {loading && <p className={styles.modalLoading}>Loading instructions…</p>}
                {error && <p className={styles.modalError}>{error}</p>}

                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{recipeName || 'Recipe'}</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                
                <Ingredients ingredients={ingredients} />

                {!loading && !error && steps.length === 0 && (
                    <p className={styles.modalEmpty}>No instructions available.</p>
                )}

                {steps.length > 0 && (
                    <ol className={styles.stepsList}>
                        {steps.map((step, i) => (
                            <li key={i} className={styles.step}>{step}</li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    )
}

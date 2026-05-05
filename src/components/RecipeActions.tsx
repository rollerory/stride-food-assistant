"use client"

import Image from 'next/image'
import { useSelector } from 'react-redux'
import { saveRecipe } from '@/services/recipeService'
import type { RootState } from '@/store/store'

import RecipesBookIcon from '@assets/icons/recipes-book.svg'
import CompareIcon from '@assets/icons/compare.svg'

import styles from '@/styles/components/recipe-actions.module.scss'

export default function RecipeActions() {
    const { recipeId, recipeDetails } = useSelector((state: RootState) => state.recipe)

    const handleSave = async () => {
        if (!recipeId || !recipeDetails?.title) {
            return
        }

        await saveRecipe({
            id: recipeId,
            title: recipeDetails.title,
        })
    }

    return (
        <div className={styles.actions}>
            <button 
                className={styles.button}
                onClick={handleSave}
            >
                <Image src={RecipesBookIcon} width={28} height={28} alt="save recipe" />
                <span className={styles.tooltip}>Save</span>
            </button>
            <button className={styles.button}>
                <Image src={CompareIcon} width={28} height={28} alt="save recipe" />
                <span className={styles.tooltip}>Compare</span>
            </button>
        </div>
    )
}

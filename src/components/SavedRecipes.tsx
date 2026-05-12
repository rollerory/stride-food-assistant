"use client"

import type { SavedRecipe } from '@/types'
import styles from '@/styles/components/saved.module.scss'
import { useState } from 'react'
import RecipeModal from './RecipeModal'

const FAT_LABELS = ['Calories', 'Protein', 'Fat', 'Carbs']
const FAT_UNITS = ['kcal', 'g', 'g', 'g']

type Props = {
    recipes: SavedRecipe[]
    recipesLoading: boolean
    error: string | null
    handleDeleteRecipe: (id: string) => void
}

type ModalState = { recipeId: number; recipeName: string | null } | null

export default function SavedRecipes({ recipes, error, handleDeleteRecipe }: Props) {
    const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)
    const [modal, setModal] = useState<ModalState>(null)

    return (
      <div className={styles.savedRecipes}>
        <h3 className={styles.savedRecipesTitle}>Saved recipes:</h3>

        {error && <p className={styles.error}>{error}</p>}

        {recipes.length > 0 ? (
          <div className={styles.recipesList}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={styles.recipeCard}
                onClick={() => setModal({ recipeId: recipe.recipe_id, recipeName: recipe.recipe_name })}
              >
                <div className={styles.recipeContent}>
                  <h3 className={styles.recipeTitle}>
                    {recipe.recipe_name || "A recipe without a name"}
                  </h3>
                  {recipe.recipe_fats && (
                    <div className={styles.savedDate}>
                      {recipe.recipe_fats.map((val, i) => (
                        <p key={i}>
                          {FAT_LABELS[i]}: {val.toFixed(1)}
                          {FAT_UNITS[i]}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirmation(recipe.id)
                  }}
                >
                  <svg width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#fb5b32"
                      d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"
                    />
                  </svg>
                </button>
                <div className={`${styles.deleteConfirmation}${deleteConfirmation === recipe.id ? ` ${styles.active}` : ''}`}>
                    <p>Are you sure you want to delete this recipe?</p>
                    <div className={styles.deleteButtons}>
                        <button
                          className={styles.deleteCencel}
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmation(null) }}
                        >
                            cancel
                        </button>
                        <button
                          className={styles.deleteConfirm}
                          onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe.id) }}
                        >
                            delete
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>You haven&apos;t saved any recipes yet</p>
        )}

        {modal && (
            <RecipeModal
                recipeId={modal.recipeId}
                recipeName={modal.recipeName}
                onClose={() => setModal(null)}
            />
        )}
      </div>
    )
}

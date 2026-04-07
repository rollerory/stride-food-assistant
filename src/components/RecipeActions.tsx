"use client"

import Image from 'next/image'

import RecipesBookIcon from '@assets/icons/recipes-book.svg'
import CompareIcon from '@assets/icons/compare.svg'

import styles from '@/styles/components/recipe-actions.module.scss'

export default function RecipeActions() {
    return (
        <div className={styles['recipe-actions']}>
            <button className={`${styles['recipe-actions__btn']} ${styles['recipe-actions__save']}`}>
                <Image src={RecipesBookIcon} width={28} height={28} alt="save recipe" />
                <span className={styles['recipe-actions__btn--tip']}>Save</span>
            </button>
            <button className={`${styles['recipe-actions__btn']} ${styles['recipe-actions__compare']}`}>
                <Image src={CompareIcon} width={28} height={28} alt="save recipe" />
                <span className={styles['recipe-actions__btn--tip']}>Compare</span>
            </button>
        </div>
    )
}
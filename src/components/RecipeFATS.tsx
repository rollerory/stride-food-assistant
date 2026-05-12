"use client"

import { Ingredient } from '@/types'
import styles from '@/styles/components/meal.module.scss'

type Props = {
    ingredients: Ingredient[];
};

const MACROS = [
    { name: "Calories", unit: "kcal" },
    { name: "Protein", unit: "g" },
    { name: "Fat", unit: "g" },
    { name: "Carbohydrates", unit: "g" },
] as const;

export default function RecipeFATS({ ingredients }: Props) {
    if (!ingredients || ingredients.length === 0) return null;

    const totals = MACROS.map(({ name, unit }) => ({
        name,
        unit,
        value: ingredients.reduce((sum, ing) => {
            const nutrient = ing.nutrients?.find((n) => n.name === name);
            return sum + (nutrient?.amount ?? 0);
        }, 0),
    }));

    return (
        <div className={styles.fats}>
            {totals.map(({ name, value, unit }) => (
                <div key={name} className={styles.fatItem}>
                    <span className={styles.fatLabel}>{name}</span>
                    <span className={styles.fatValue}>{value.toFixed(1)}{unit}</span>
                </div>
            ))}
        </div>
    )
}

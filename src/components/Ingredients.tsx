"use client"

import { Ingredient } from '@/types'
import styles from '@/styles/components/meal.module.scss'

type Props = {
    ingredients: Ingredient[];
};

export default function Ingredients({ ingredients }: Props) {
    if (!ingredients || ingredients.length === 0) return null;

    return (
        <div className={styles.recipe}>
            {ingredients.map((ingredient, idx) => (
                <div key={ingredient.id ?? ingredient.name ?? idx} className={styles.ingredient}>
                    <div className={styles.name}>{ingredient.name}</div>
                    <div className={styles.details}>
                        <p className={styles.weight}>{ingredient.amount} {ingredient.unit} |</p>
                        <p className={styles.nutrition}>
                            {ingredient.nutrients && [
                                {
                                    name: "Calories",
                                    value: ingredient.nutrients.find((n) => n.name === "Calories")?.amount || 0,
                                    unit: "kcal"
                                },
                                {
                                    name: "Protein",
                                    value: ingredient.nutrients.find((n) => n.name === "Protein")?.amount || 0,
                                    unit: "g"
                                },
                                {
                                    name: "Fat",
                                    value: ingredient.nutrients.find((n) => n.name === "Fat")?.amount || 0,
                                    unit: "g"
                                },
                                {
                                    name: "Carbohydrates",
                                    value: ingredient.nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0,
                                    unit: "g"
                                }
                            ]
                                .filter(nutrient => nutrient.value > 0)
                                .map(nutrient => `${nutrient.name} ${nutrient.value.toFixed(1)}${nutrient.unit}`)
                                .join(' | ')}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

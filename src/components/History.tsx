"use client"

import { Recipe } from '@/types'
import styles from '@/styles/components/meal.module.scss'

type Props = {
    show: boolean;
    lastRecipes: Recipe[];
    onSelect: (title: string, id: number) => void;
    onClose?: () => void;
};

export default function History({ show, lastRecipes, onSelect }: Props) {
    if (!show) return null;

    return (
        <div className={styles.search__history}>
            {lastRecipes.length === 0 && <p>No search history</p>}
            {lastRecipes.map((item) => (
                <div
                    key={`history-${item.id}`}
                    className={styles['search__history-item']}
                    onClick={() => onSelect(item.title, item.id)}
                >
                    {item.title}
                </div>
            ))}
        </div>
    );
}

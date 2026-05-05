"use client"

import { Recipe } from '@/types'
import styles from '@/styles/components/meal.module.scss'
import { useAuth } from '@/context/AuthContext';

type Props = {
    show: boolean;
    lastRecipes: Recipe[];
    onSelect: (title: string, id: number) => void;
    onClose?: () => void;
};

export default function History({ show, lastRecipes, onSelect }: Props) {
    const { isAuthenticated } = useAuth()
    if (!show) return null;

    return (
        <div className={styles.history}>
            {!isAuthenticated && <p>Authorize to view search history</p>}
            {isAuthenticated && lastRecipes.length === 0 && <p>No search history</p>}
            {isAuthenticated && lastRecipes.map((item) => (
                <div
                    key={`history-${item.id}`}
                    className={styles.historyItem}
                    onClick={() => onSelect(item.title, item.id)}
                >
                    {item.title}
                </div>
            ))}
        </div>
    );
}

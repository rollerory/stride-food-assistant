"use client"

import { Suggestion } from '@/types'
import styles from '@/styles/components/meal.module.scss'

type Props = {
    suggestions: Suggestion[];
    show: boolean;
    onSelect: (title: string, id: number) => void;
};

export default function Suggestions({ suggestions, show, onSelect }: Props) {
    if (!show) return null;

    return (
        <div className={styles['search-results']}> 
            {suggestions.map((item) => (
                <div
                    key={`suggestion-${item.id}`}
                    className={styles['search-results__item']}
                    onClick={() => onSelect(item.title, item.id)}
                >
                    {item.title}
                </div>
            ))}
        </div>
    );
}

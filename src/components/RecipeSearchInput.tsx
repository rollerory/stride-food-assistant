"use client"

import Image from "next/image";
import crossIcon from '@assets/icons/cross.svg'
import notebookIcon from '@assets/icons/notebook.svg'
import { Suggestion, Recipe } from '@/types'
import styles from '@/styles/components/meal.module.scss'
import Suggestions from './Suggestions'
import History from './History'

type Props = {
    search: string;
    onChange: (value: string) => void;
    onClear: () => void;
    onToggleHistory: () => void;
    suggestions?: Suggestion[];
    showSuggestions?: boolean;
    onSelectSuggestion?: (title: string, id: number) => void;
    lastRecipes?: Recipe[];
    showHistory?: boolean;
    onSelectHistory?: (title: string, id: number) => void;
};

export default function RecipeSearchInput({ search, onChange, onClear, onToggleHistory, suggestions = [], showSuggestions = false, onSelectSuggestion, lastRecipes = [], showHistory = false, onSelectHistory }: Props) {
    return (
        <div className={styles.search}>
            <input
                className={styles.search__input}
                type="text"
                value={search}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter dish name"
            />

            {search && (
                <button className={styles['search__input-clear']} onClick={onClear}>
                    <Image width={20} height={20} src={crossIcon} alt="clear" />
                </button>
            )}

            <button className={styles['search__history-btn']} onClick={onToggleHistory}>
                <Image width={22} height={22} src={notebookIcon} alt="history" />
            </button>

            {showHistory ? (
                <History show={showHistory} lastRecipes={lastRecipes ?? []} onSelect={(t, i) => onSelectHistory && onSelectHistory(t, i)} />
            ) : (
                <Suggestions suggestions={suggestions} show={showSuggestions} onSelect={(t, i) => onSelectSuggestion && onSelectSuggestion(t, i)} />
            )}
        </div>
    );
}

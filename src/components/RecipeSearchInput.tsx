"use client"

import Image from "next/image";
import crossIcon from '@assets/icons/cross.svg'
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
                className={styles.input}
                type="text"
                value={search}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter dish name"
            />

            {search && (
                <button className={styles.clearButton} onClick={onClear}>
                    <Image width={20} height={20} src={crossIcon} alt="clear" />
                </button>
            )}

            <button className={styles.historyButton} onClick={onToggleHistory}>
                {/* <Image width={22} height={22} src={notebookIcon} alt="history" /> */}
                <svg width="22px" height="22px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#507F69" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"/><path fill="#507F69" d="M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32z"/><path fill="#507F69" d="M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32z"/></svg>
            </button>

            {showHistory ? (
                <History show={showHistory} lastRecipes={lastRecipes ?? []} onSelect={(t, i) => onSelectHistory && onSelectHistory(t, i)} />
            ) : (
                <Suggestions suggestions={suggestions} show={showSuggestions} onSelect={(t, i) => onSelectSuggestion && onSelectSuggestion(t, i)} />
            )}
        </div>
    );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordPair } from './wordGenerator';

const HISTORY_STORAGE_KEY = 'undercover_word_history';

// Map of PackID -> Array of Used Word IDs (or content hashes)
type HistoryMap = Record<string, string[]>;

export const STATIC_PACK_ID_STANDARD = 'STANDARD_STATIC_V1';
export const STATIC_PACK_ID_SPICY = 'SPICY_STATIC_V1';

export const WordHistoryService = {
    // Cache available words to avoid frequent async reads
    _historyCache: {} as HistoryMap,
    _isInitialized: false,

    async init() {
        if (this._isInitialized) return;
        try {
            const data = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
            if (data) {
                this._historyCache = JSON.parse(data);
            }
            this._isInitialized = true;
        } catch (e) {
            console.error('Failed to init word history:', e);
            this._historyCache = {};
        }
    },

    async _save() {
        try {
            await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this._historyCache));
        } catch (e) {
            console.error('Failed to save word history:', e);
        }
    },

    _getWordKey(word: WordPair): string {
        // Prefer ID, fallback to content combination
        if (word.id) return word.id;
        return `${word.civilian}|${word.undercover}`;
    },

    /**
     * smartPickWord
     * Selects a random word from the pack that hasn't been used yet.
     * If all words are used, it automatically resets the history for this pack (reshuffles).
     */
    async getUnusedWord(packId: string, allWords: WordPair[]): Promise<WordPair | null> {
        if (allWords.length === 0) return null;

        await this.init();

        const usedKeys = new Set(this._historyCache[packId] || []);

        // Filter for unused words
        const unusedWords = allWords.filter(w => !usedKeys.has(this._getWordKey(w)));

        let selectedWord: WordPair;

        if (unusedWords.length === 0) {
            // DECK EMPTY! Reshuffle time.
            console.log(`[WordHistory] Pack ${packId} exhausted (${allWords.length} words). Reshuffling!`);

            // Clear history for this pack
            this._historyCache[packId] = [];

            // Pick from full list
            const randomIndex = Math.floor(Math.random() * allWords.length);
            selectedWord = allWords[randomIndex];
        } else {
            // Normal pick from unused
            console.log(`[WordHistory] Pack ${packId}: Picking from ${unusedWords.length} unused words.`);
            const randomIndex = Math.floor(Math.random() * unusedWords.length);
            selectedWord = unusedWords[randomIndex];
        }

        // Mark as used
        const key = this._getWordKey(selectedWord);
        if (!this._historyCache[packId]) {
            this._historyCache[packId] = [];
        }

        // Add to history if not already there (avoid dupes in history)
        if (!this._historyCache[packId].includes(key)) {
            this._historyCache[packId].push(key);
            await this._save();
        }

        return selectedWord;
    },

    /**
     * Manually reset history for a pack (e.g. if user requests it)
     */
    async resetPackHistory(packId: string) {
        await this.init();
        delete this._historyCache[packId];
        await this._save();
    }
};

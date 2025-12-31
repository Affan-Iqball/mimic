import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomStaticWord } from './staticWords';

// Groq API Configuration
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const STORAGE_KEY = 'undercover_words';
const MAX_WORD_COUNT = 4000;

export interface WordPair {
    civilian: string;
    undercover: string;
    category: string;
    id?: string; // Optional - auto-generated if not provided
}

const SYSTEM_PROMPT = (mode: 'standard' | 'spicy') => {
    const baseRules = `You are a word generator for the party game "Undercover". Your job is to generate pairs of similar but distinct words.
RULES:
1. Generate ONE word pair: a "civilian" word and a similar "undercover" word
2. The words must be related but distinguishable.
3. RESPOND IN THIS EXACT JSON FORMAT ONLY: {"civilian": "word1", "undercover": "word2", "category": "category_name"}`;

    if (mode === 'spicy') {
        return `${baseRules}
TONE: Edgy, Mature, and Taboo. Focus on relationship drama, dark humor, controversial figures, and adult themes (without being pornographic).
- Good examples: "Infidelity / Flirting", "Divorce / Breakup", "Bribery / Gift", "Banned / Censored"
- Good examples: "Ex-Girlfriend / Best Friend", "Secret / Scandal", "Politics / Religion"
- Good examples: "Imran Khan / Nawaz Sharif", "Love Marriage / Arranged Marriage" (Mature social topics)`;
    }

    return `${baseRules}
TONE: Mature and Intelligent. Mix of cultures: Blend Pakistani/Desi, Islamic, and Western references.
- Good examples: "Narcissist / Confident", "Democracy / Dictatorship", "Love / Obsession"
- Good examples: "Karachi / Mumbai", "Dubai / Doha"
- Include: Pakistani cities, Islamic terms, Global concepts. Urban-friendly.`;
};

const AVOID_PROMPT_PREFIX = `DO NOT use any of the following words or concepts, generate something completely new:\n`;

async function getSavedWords(): Promise<WordPair[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

async function saveWord(word: WordPair): Promise<void> {
    try {
        const existing = await getSavedWords();
        existing.push(word);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
        console.error('Failed to save word:', e);
    }
}

export async function getWordCount(): Promise<number> {
    const words = await getSavedWords();
    return words.length;
}

export async function getRandomSavedWord(): Promise<WordPair | null> {
    const words = await getSavedWords();
    if (words.length === 0) return null;
    return words[Math.floor(Math.random() * words.length)];
}

async function callGroq(prompt: string, mode: 'standard' | 'spicy' = 'standard', retries = 3): Promise<{ success: boolean; data?: any; error?: string; isQuotaError?: boolean }> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (!GROQ_API_KEY) {
                return { success: false, error: 'API Key missing' };
            }
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT(mode) },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.95,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 429 || errorText.toLowerCase().includes('quota') || errorText.toLowerCase().includes('rate limit')) {
                    return { success: false, error: 'quota_exceeded', isQuotaError: true };
                }
                if (attempt === retries) return { success: false, error: `API Error: ${response.status}` };
                continue;
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                if (attempt === retries) return { success: false, error: 'Empty response from AI' };
                continue;
            }

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                if (attempt === retries) return { success: false, error: 'Invalid response format' };
                continue;
            }

            const parsed = JSON.parse(jsonMatch[0]);
            if (!parsed.civilian || !parsed.undercover) {
                if (attempt === retries) return { success: false, error: 'Missing word fields' };
                continue;
            }

            return { success: true, data: parsed };

        } catch (e: any) {
            if (e.message?.includes('Network') || e.message?.includes('fetch')) {
                return { success: false, error: 'network_error' };
            }
            if (attempt === retries) return { success: false, error: e.message || 'Unknown error' };
        }
    }
    return { success: false, error: 'Max retries exceeded' };
}

export async function generateWordPair(mode: 'standard' | 'spicy' = 'standard'): Promise<{
    success: boolean;
    wordPair?: WordPair;
    error?: string;
    isQuotaError?: boolean;
    isNetworkError?: boolean;
}> {
    // 1. Get recent words to avoid duplicates
    const savedWords = await getSavedWords();

    // Take last 40 pairs to send as negative constraint
    const recentPairs = savedWords.slice(-40);
    const recentWordsList = recentPairs
        .map(w => `${w.civilian}, ${w.undercover}`)
        .join(', ');

    let prompt = `Generate a new ${mode === 'spicy' ? 'edgy/mature' : 'standard'} word pair for the Undercover game.`;
    if (recentWordsList.length > 0) {
        prompt += `\n${AVOID_PROMPT_PREFIX}${recentWordsList}`;
    }

    const result = await callGroq(prompt, mode);

    if (!result.success) {
        if (result.isQuotaError) {
            // SILENT FALLBACK to Static Library if Quota Exceeded
            return { success: true, wordPair: getRandomStaticWord(mode) };
        }
        if (result.error === 'network_error') {
            // SILENT FALLBACK to Static Library if Network Error
            return { success: true, wordPair: getRandomStaticWord(mode) };
        }
        // Any other error, use static
        return { success: true, wordPair: getRandomStaticWord(mode) };
    }

    // Double check duplicates
    const isDuplicate = savedWords.some(w =>
        w.civilian.toLowerCase() === result.data.civilian.toLowerCase() ||
        w.undercover.toLowerCase() === result.data.undercover.toLowerCase()
    );

    if (isDuplicate) {
        console.log('AI duplicate detected, using static word');
        return { success: true, wordPair: getRandomStaticWord(mode) };
    }

    const wordPair: WordPair = {
        civilian: result.data.civilian,
        undercover: result.data.undercover,
        category: result.data.category || 'General',
        id: Date.now().toString()
    };

    await saveWord(wordPair);
    return { success: true, wordPair };
}

// Fallback is now just reading from the massive static library
export function getFallbackWord(mode: 'standard' | 'spicy' = 'standard'): WordPair {
    return getRandomStaticWord(mode);
}

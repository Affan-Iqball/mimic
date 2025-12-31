import NetInfo from '@react-native-community/netinfo';

// Groq API Configuration
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GuessResult {
    isCorrect: boolean;
    usedAI: boolean;
    message?: string;
}

/**
 * Validates a guess against the actual civilian word.
 * Uses Groq AI (llama-3.1-8b-instant) when online for typo tolerance, falls back to exact match offline.
 */
export async function validateGuess(guess: string, actualWord: string): Promise<GuessResult> {
    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedActual = actualWord.trim().toLowerCase();

    // Check if online
    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected && netState.isInternetReachable;

    if (!isOnline) {
        // Offline: Exact match only (case-insensitive)
        const isCorrect = normalizedGuess === normalizedActual;
        return {
            isCorrect,
            usedAI: false,
            message: isCorrect ? 'Correct! (Offline mode - exact match)' : 'Wrong guess. (Offline mode - exact match only)'
        };
    }

    // Online: Try Groq API for typo tolerance
    try {
        const response = await callGroqForGuessValidation(guess, actualWord);
        return {
            isCorrect: response.isCorrect,
            usedAI: true,
            message: response.message
        };
    } catch (error) {
        // Fallback to exact match if API fails
        console.warn('Groq API failed, falling back to exact match:', error);
        const isCorrect = normalizedGuess === normalizedActual;
        return {
            isCorrect,
            usedAI: false,
            message: isCorrect ? 'Correct!' : 'Wrong guess. (API unavailable - exact match used)'
        };
    }
}

/**
 * Calls Groq API (llama-3.1-8b-instant) to validate guess with typo tolerance.
 * Only accepts exact matches or minor typos.
 */
async function callGroqForGuessValidation(guess: string, actualWord: string): Promise<{ isCorrect: boolean; message: string }> {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    const prompt = `You are a LENIENT word comparison judge for a party game. Be generous!
    
The player's guess: "${guess}"
The actual word: "${actualWord}"

Your job is to determine if the guess is close enough to be CORRECT.

ACCEPT the guess if:
1. Exact match (case-insensitive): "pikachu" = "Pikachu" ✓
2. Typos (any number of character errors): "Pikachoo" = "Pikachu" ✓, "Pkachu" = "Pikachu" ✓
3. Very similar/close words: "Couch" = "Sofa" ✓, "Phone" = "Mobile" ✓
4. Same concept different phrasing: "New York" = "NYC" ✓, "United States" = "USA" ✓
5. Phonetically similar: "Colour" = "Color" ✓

BE GENEROUS - if it's anywhere close to the actual word, ACCEPT IT.

Only REJECT if the guess is completely unrelated or a totally different concept.

Respond with ONLY a JSON object (no markdown):
{"isCorrect": true/false, "reason": "brief explanation"}`;

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 100
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error('Empty response from Groq');
    }

    // Parse JSON response
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                isCorrect: parsed.isCorrect === true,
                message: parsed.reason || (parsed.isCorrect ? 'Correct!' : 'Wrong guess.')
            };
        }
    } catch {
        // If parsing fails, check for keywords
        const lowerText = text.toLowerCase();
        if (lowerText.includes('"iscorrect": true') || lowerText.includes('"iscorrect":true')) {
            return { isCorrect: true, message: 'Correct!' };
        }
    }

    return { isCorrect: false, message: 'Could not verify guess.' };
}

import NetInfo from '@react-native-community/netinfo';

// Groq API Configuration (User specified Kimi model is on Groq)
const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GuessResult {
    isCorrect: boolean;
    usedAI: boolean;
    message?: string;
}

/**
 * Validates a guess against the actual civilian word.
 * Uses AI (moonshotai/kimi-k2-instruct) when online for smart validation, falls back to exact match offline.
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

    // Online: Try AI API for smart validation
    try {
        const response = await callAIForGuessValidation(guess, actualWord);
        return {
            isCorrect: response.isCorrect,
            usedAI: true,
            message: response.message
        };
    } catch (error) {
        // Fallback to exact match if API fails
        console.warn('AI API failed, falling back to exact match:', error);
        const isCorrect = normalizedGuess === normalizedActual;
        return {
            isCorrect,
            usedAI: false,
            message: isCorrect ? 'Correct!' : 'Wrong guess. (API unavailable - exact match used)'
        };
    }
}

/**
 * Calls AI API (moonshotai/kimi-k2-instruct) for smart validation.
 * Strict on distinct concepts, lenient on typos/synonyms.
 */
async function callAIForGuessValidation(guess: string, actualWord: string): Promise<{ isCorrect: boolean; message: string }> {
    if (!API_KEY) {
        throw new Error('API key not configured');
    }

    const prompt = `You are a FAIR word comparison judge for a party game.
    
The player's guess: "${guess}"
The actual word: "${actualWord}"

Your job is to determine if the guess is practically the SAME WORD or CONCEPT as the actual word.

GUIDELINES:
1. ACCEPT Typos: "Pikachoo" = "Pikachu" ✓
2. ACCEPT Synonyms/Slang: "Mobile" = "Phone" ✓, "Couch" = "Sofa" ✓
3. ACCEPT Plurals/Singulars: "Apples" = "Apple" ✓

4. STRICTLY REJECT Related but DISTINCT concepts:
   - "Car" != "Engine" (Part of is NOT the same)
   - "Protein" != "Chicken" (Contains is NOT the same)
   - "Protein" != "Semen" (Contains is NOT the same - STRICT REJECT)
   - "Ocean" != "Water" (Made of is NOT the same)

If the words are technically related but mean different things, REJECT IT.
Only accept if they are interchangeable in normal conversation.

Respond with ONLY a JSON object:
{"isCorrect": true/false, "reason": "brief explanation"}`;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mimic-game.app', // Required for OpenRouter
            'X-Title': 'Mimic Game'
        },
        body: JSON.stringify({
            model: 'moonshotai/kimi-k2-instruct',
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 100
        })
    });

    if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error('Empty response from AI');
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

import { WordPair, generateWordPair, getRandomSavedWord, getFallbackWord } from './wordGenerator';

export interface Player {
    id: number;
    name: string;
    role: 'civilian' | 'undercover' | 'mrwhite';
    picked: boolean;
    manualName?: string; // If player inputs name manually
}

export interface GameState {
    isActive: boolean;
    players: Player[];
    wordPair: WordPair | null;
    totalUndercovers: number;
    totalMrWhites: number;
}

let currentState: GameState = {
    isActive: false,
    players: [],
    wordPair: null,
    totalUndercovers: 0,
    totalMrWhites: 0,
};

export const GameService = {
    // Initialize a new game
    async startGame(
        totalPlayers: number,
        undercoversCount: number,
        mrWhitesCount: number,
        groupPlayers: string[] = [], // Optional pre-filled names
        mode: 'standard' | 'spicy' = 'standard'
    ): Promise<{ success: boolean; error?: string }> {

        // 1. Prepare Player Names (shuffle if provided)
        let playerNames: string[] = [];
        if (groupPlayers.length > 0) {
            // Shuffle group player names for randomness
            playerNames = [...groupPlayers];
            for (let i = playerNames.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playerNames[i], playerNames[j]] = [playerNames[j], playerNames[i]];
            }
        } else {
            // Generate numbered player names
            playerNames = Array.from({ length: totalPlayers }, (_, i) => `Player ${i + 1}`);
        }

        // 2. Assign Roles and Shuffle
        const roles: ('civilian' | 'undercover' | 'mrwhite')[] = [];
        for (let i = 0; i < undercoversCount; i++) roles.push('undercover');
        for (let i = 0; i < mrWhitesCount; i++) roles.push('mrwhite');
        const civiliansCount = totalPlayers - undercoversCount - mrWhitesCount;
        for (let i = 0; i < civiliansCount; i++) roles.push('civilian');

        // Shuffle roles using Fisher-Yates
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // 3. Create Players with shuffled names and roles
        const newPlayers: Player[] = Array.from({ length: totalPlayers }).map((_, index) => ({
            id: index,
            name: playerNames[index],
            role: roles[index],
            picked: false,
            manualName: groupPlayers.length > 0 ? playerNames[index] : undefined
        }));

        // 4. Generate Words (ONLY ONCE)
        let words: WordPair | null = null;
        try {
            const result = await generateWordPair(mode);
            if (result.success && result.wordPair) {
                words = result.wordPair;
            } else {
                // Fallback strategies handled in UI usually, but here we enforce assignment
                if (result.isQuotaError) {
                    const saved = await getRandomSavedWord();
                    words = saved || getFallbackWord(mode);
                } else {
                    words = getFallbackWord(mode);
                }
            }
        } catch (e) {
            words = getFallbackWord(mode);
        }

        // 4. Set State
        currentState = {
            isActive: true,
            players: newPlayers,
            wordPair: words,
            totalUndercovers: undercoversCount,
            totalMrWhites: mrWhitesCount
        };

        return { success: true };
    },

    getState() {
        return currentState;
    },

    updatePlayerName(index: number, name: string) {
        if (currentState.players[index]) {
            currentState.players[index].manualName = name;
            currentState.players[index].name = name; // Update display name too
        }
    },

    markCardPicked(index: number) {
        if (currentState.players[index]) {
            currentState.players[index].picked = true;
        }
    },

    resetGame() {
        currentState = {
            isActive: false,
            players: [],
            wordPair: null,
            totalUndercovers: 0,
            totalMrWhites: 0,
        };
    }
};

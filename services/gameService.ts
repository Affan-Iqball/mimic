import { WordPair, generateWordPair, getRandomSavedWord, getFallbackWord } from './wordGenerator';
import { WordPack, PackService } from './packService';

export interface Player {
    id: number;
    name: string;
    role: 'civilian' | 'undercover' | 'mrwhite';
    picked: boolean;
    eliminated: boolean;
    manualName?: string; // If player inputs name manually
}

export interface GameState {
    isActive: boolean;
    players: Player[];
    wordPair: WordPair | null;
    totalUndercovers: number;
    totalMrWhites: number;
    pickingOrder: string[]; // Shuffled list of player names for picking turn
    currentPickerIndex: number; // Index in pickingOrder for whose turn it is
}

let currentState: GameState = {
    isActive: false,
    players: [],
    wordPair: null,
    totalUndercovers: 0,
    totalMrWhites: 0,
    pickingOrder: [],
    currentPickerIndex: 0,
};

// Support multiple pack selection
let selectedCustomPacks: WordPack[] = [];

// Track last played group for "Play Again" feature
let lastGroupId: string | null = null;

export const GameService = {
    // Set multiple packs (replaces old single pack method)
    setCustomPacks(packs: WordPack[]) {
        selectedCustomPacks = packs;
    },

    // Legacy single pack support (adds to array)
    setCustomPack(pack: WordPack | null) {
        if (pack) {
            selectedCustomPacks = [pack];
        } else {
            selectedCustomPacks = [];
        }
    },

    addCustomPack(pack: WordPack) {
        // Don't add duplicates
        if (!selectedCustomPacks.find(p => p.id === pack.id)) {
            selectedCustomPacks.push(pack);
        }
    },

    removeCustomPack(packId: string) {
        selectedCustomPacks = selectedCustomPacks.filter(p => p.id !== packId);
    },

    getSelectedPacks() {
        return selectedCustomPacks;
    },

    // Legacy getter (returns first pack or null)
    getSelectedPack() {
        return selectedCustomPacks.length > 0 ? selectedCustomPacks[0] : null;
    },

    isPackSelected(packId: string): boolean {
        return selectedCustomPacks.some(p => p.id === packId);
    },

    clearSelectedPacks() {
        selectedCustomPacks = [];
    },

    // Track last played group for "Play Again"
    setLastGroupId(groupId: string | null) {
        lastGroupId = groupId;
    },

    getLastGroupId(): string | null {
        return lastGroupId;
    },

    // Initialize a new game
    async startGame(
        totalPlayers: number,
        undercoversCount: number,
        mrWhitesCount: number,
        groupPlayers: string[] = [], // Optional pre-filled names
        mode: 'standard' | 'spicy' = 'standard'
    ): Promise<{ success: boolean; error?: string }> {

        // 1. Roles will be shuffled and assigned to card positions
        // Names will be assigned when players pick cards based on pickingOrder

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

        // 3. Create Players with roles but NO NAMES YET (names assigned when picking)
        const newPlayers: Player[] = Array.from({ length: totalPlayers }).map((_, index) => ({
            id: index,
            name: '', // Name will be assigned when player picks this card
            role: roles[index],
            picked: false,
            eliminated: false,
            manualName: undefined
        }));

        // 4. Create picking order (shuffled list of names)
        let pickingOrder: string[] = [];
        if (groupPlayers.length > 0) {
            // Shuffle group player names for random picking order
            pickingOrder = [...groupPlayers];
            for (let i = pickingOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pickingOrder[i], pickingOrder[j]] = [pickingOrder[j], pickingOrder[i]];
            }
        } else {
            // Generate numbered player names in random order
            pickingOrder = Array.from({ length: totalPlayers }, (_, i) => `Player ${i + 1}`);
            for (let i = pickingOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pickingOrder[i], pickingOrder[j]] = [pickingOrder[j], pickingOrder[i]];
            }
        }

        // 4. Generate Words (ONLY ONCE)
        let words: WordPair | null = null;

        if (selectedCustomPacks.length > 0) {
            // EQUAL PROBABILITY SELECTION:
            // Step 1: Randomly pick a pack (each pack has equal chance regardless of word count)
            const randomPackIndex = Math.floor(Math.random() * selectedCustomPacks.length);
            const selectedPack = selectedCustomPacks[randomPackIndex];

            // Step 2: Randomly pick a word from that pack
            const randomWordIndex = Math.floor(Math.random() * selectedPack.words.length);
            words = selectedPack.words[randomWordIndex];

            // Fire and forget play count increment
            PackService.incrementPackPlays(selectedPack.id);
        } else {
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
        }

        // 5. Set State
        currentState = {
            isActive: true,
            players: newPlayers,
            wordPair: words,
            totalUndercovers: undercoversCount,
            totalMrWhites: mrWhitesCount,
            pickingOrder: pickingOrder,
            currentPickerIndex: 0
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
        if (currentState.players[index] && !currentState.players[index].picked) {
            // Assign the current picker's name to this card
            const currentPickerName = currentState.pickingOrder[currentState.currentPickerIndex];
            currentState.players[index].name = currentPickerName;
            currentState.players[index].manualName = currentPickerName;
            currentState.players[index].picked = true;

            // Advance to next picker
            currentState.currentPickerIndex++;
        }
    },

    // Get the current picker's name (whose turn it is to pick)
    getCurrentPickerName(): string | null {
        if (currentState.currentPickerIndex < currentState.pickingOrder.length) {
            return currentState.pickingOrder[currentState.currentPickerIndex];
        }
        return null; // All players have picked
    },

    // Get count of remaining (non-eliminated) civilians
    remainingCivilians(): number {
        return currentState.players.filter(p => !p.eliminated && p.role === 'civilian').length;
    },

    // Get count of remaining infiltrators (undercover + mrwhite)
    remainingInfiltrators(): number {
        return currentState.players.filter(p => !p.eliminated && (p.role === 'undercover' || p.role === 'mrwhite')).length;
    },

    // Eliminate a player by index
    eliminatePlayer(index: number): Player | null {
        if (currentState.players[index] && !currentState.players[index].eliminated) {
            currentState.players[index].eliminated = true;
            return currentState.players[index];
        }
        return null;
    },

    // Check win condition after elimination
    // Returns: 'civilians' | 'infiltrators' | null (game continues)
    checkWinCondition(): 'civilians' | 'infiltrators' | null {
        const remainingCivs = this.remainingCivilians();
        const remainingInfil = this.remainingInfiltrators();

        // Infiltrators win if only 1 civilian left
        if (remainingCivs <= 1) {
            return 'infiltrators';
        }

        // Civilians win if all infiltrators eliminated
        if (remainingInfil === 0) {
            return 'civilians';
        }

        // Game continues
        return null;
    },

    resetGame() {
        currentState = {
            isActive: false,
            players: [],
            wordPair: null,
            totalUndercovers: 0,
            totalMrWhites: 0,
            pickingOrder: [],
            currentPickerIndex: 0,
        };
    }
};

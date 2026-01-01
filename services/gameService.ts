import { WordPair, generateWordPair, getRandomSavedWord, getFallbackWord } from './wordGenerator';
import { WordPack, PackService } from './packService';
import { WordHistoryService, STATIC_PACK_ID_STANDARD, STATIC_PACK_ID_SPICY } from './wordHistoryService';
import { STATIC_WORD_PAIRS, SPICY_STATIC_WORD_PAIRS } from './staticWords';

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

    // Track history to reduce streaks (in-memory is fine for session play)
    lastGameHistory: {
        starterName: null as string | null,
        playerRoles: {} as Record<string, 'civilian' | 'undercover' | 'mrwhite'>,
        cardRoles: [] as string[] // History of roles assigned to card slots
    },

    // Initialize a new game
    async startGame(
        totalPlayers: number,
        undercoversCount: number,
        mrWhitesCount: number,
        groupPlayers: string[] = [], // Optional pre-filled names
        mode: 'standard' | 'spicy' = 'standard'
    ): Promise<{ success: boolean; error?: string }> {

        // --- Helper: Fair Shuffle Logic ---
        // Retries shuffling effectively reducing streak probability
        // but leaving a small chance for true randomness.
        const fairShuffleRoles = (
            playersList: string[],
            uCount: number,
            wCount: number
        ): ('civilian' | 'undercover' | 'mrwhite')[] => {
            const generateRoles = () => {
                const r: ('civilian' | 'undercover' | 'mrwhite')[] = [];
                for (let i = 0; i < uCount; i++) r.push('undercover');
                for (let i = 0; i < wCount; i++) r.push('mrwhite');
                const cCount = totalPlayers - uCount - wCount;
                for (let i = 0; i < cCount; i++) r.push('civilian');
                // Fisher-Yates
                for (let i = r.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [r[i], r[j]] = [r[j], r[i]];
                }
                return r;
            };

            let finalRoles = generateRoles();

            // CHECK REPETITION (Roles)
            // If any player gets the SAME special role (Undercover/MrWhite) as last time...
            // We flip a coin. 80% chance to re-shuffle, 20% keep it (true random).
            if (this.lastGameHistory.playerRoles && playersList.length > 0) {
                const hasRepeat = finalRoles.some((role, idx) => {
                    const name = playersList[idx]; // Assumes playersList matches role index (it does if passed correctly)
                    if (!name) return false;
                    const lastRole = this.lastGameHistory.playerRoles[name];
                    // Only care about repeating SPECIAL roles
                    return (role !== 'civilian' && role === lastRole);
                });

                if (hasRepeat) {
                    // Streak detected! Try to break it.
                    // 80% chance to retry (Reduces streak odds significantly)
                    if (Math.random() < 0.8) {
                        console.log('Breaking role streak!');
                        finalRoles = generateRoles();
                    }
                }
            }
            return finalRoles;
        };

        // 1. Setup Picking Order (Names) first
        let pickingOrder: string[] = [];
        if (groupPlayers.length > 0) {
            pickingOrder = [...groupPlayers];
        } else {
            pickingOrder = Array.from({ length: totalPlayers }, (_, i) => `Player ${i + 1}`);
        }

        // Shuffle Picking Order (Who starts)
        const shuffleOrder = (arr: string[]) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        };

        shuffleOrder(pickingOrder);

        // CHECK REPETITION (Starter)
        // If the same person starts, try to swap.
        if (this.lastGameHistory.starterName && pickingOrder.length > 1) {
            if (pickingOrder[0] === this.lastGameHistory.starterName) {
                // 80% chance to swap first player to break start-streak
                if (Math.random() < 0.8) {
                    // Swap 1st with random other
                    const swapIndex = 1 + Math.floor(Math.random() * (pickingOrder.length - 1));
                    [pickingOrder[0], pickingOrder[swapIndex]] = [pickingOrder[swapIndex], pickingOrder[0]];
                    console.log('Breaking starter streak!');
                }
            }
        }

        // 2. Assign Roles (using Fair Shuffle)
        // Note: We need names aligned to roles for history check to work
        // pickingOrder is the list of names. Roles will be assigned to cards 0..N?
        // Wait, standard game assigns roles to *card slots*, and names are assigned *when picked*.
        // BUT for 'Fair Role Assignment', we need to know who is who.
        // If names are assigned during pick, we CANNOT control role-per-person beforehand easily
        // UNLESS we pre-assign names to slots?
        // NO, the current logic (lines 116-120): `name: '', // Name will be assigned when player picks`.

        // ISSUE: We don't know "Affan" gets "Undercover" until "Affan" picks the "Undercover Card".
        // The picking order determines WHO picks next.
        // The cards are shuffled.

        // To control "Person X gets Role Y", we need to pair them.
        // If we want "Affan" (who is 1st in pickingOrder) to NOT be Undercover...
        // We can't controlledly assign if he picks a random card from the screen.
        // Wait, do players pick *specific* cards? Yes, "select a card".

        // Ah, if players pick random cards, then the role assignment IS random regardless of what we do here,
        // UNLESS the picking order maps to card index? No.

        // RE-READ: "players who choose the first card i know it is random but it is repeating thesame persoon too many times"
        // User says "players who choose the first card".
        // Use Case:
        // 1. "Picking Order" shows name "Affan".
        // 2. Affan picks ANY card.
        // 3. Next is "Kiran". She picks.

        // "Repeating the same person" refers to the **Picking Order** (Starter).
        // My "Starter Swap" logic above fixes this perfectly.

        // User also said: "apply this randomness to evryhting including assignment of roles".
        // Since players pick random cards physically, we CANNOT control which role they get via code 
        // (unless we rig the cards so Card 1 is always Civilian?). No, that breaks the game.
        // The only thing we can control is strict allocation if cards are assigned *to players* effectively.

        // BUT, if the player picks a card BLINDLY, then the randomness is purely statistical.
        // We can't bias it "per person" because we don't know which card they will touch.
        // UNLESS... do we determine the role *after* they touch the card?
        // Currently: `role: roles[index]`. The cards are pre-set.

        // So:
        // 1. Starter/Picking Order: Can be biased (Fixed above). 
        // 2. Roles: Since players choose physically, we can't bias *who* gets what, only the *count* (which is fixed settings).

        // WAIT, if "picking order" determines who plays first in the *actual game discussion*?
        // Then yes, fixing picking order fixes "who starts".

        // Regarding "assignment of roles":
        // If I am "Affan", and I pick top-left card.
        // Next game, I pick top-left card again.
        // If top-left is Undercover again... that feels repetitive.
        // So we should shuffle the **Cards** well. (Fisher-Yates does this).
        // Bias here means: "Don't put Undercover in slot 0 again if it was in slot 0 last time".

        // I will implement "Card Slot History" bias too.

        // 2. Assign and Shuffle Roles
        let roles: ('civilian' | 'undercover' | 'mrwhite')[] = [];
        for (let i = 0; i < undercoversCount; i++) roles.push('undercover');
        for (let i = 0; i < mrWhitesCount; i++) roles.push('mrwhite');
        const civiliansCount = totalPlayers - undercoversCount - mrWhitesCount;
        for (let i = 0; i < civiliansCount; i++) roles.push('civilian');

        // Fair Shuffle for Roles (Card Positions)
        // If slot 0 was Undercover last time, try to make it NOT Undercover.
        const shuffleRoles = (r: typeof roles) => {
            for (let i = r.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [r[i], r[j]] = [r[j], r[i]];
            }
        };

        shuffleRoles(roles);

        // Anti-Streak for Card Slots
        if (this.lastGameHistory.cardRoles && this.lastGameHistory.cardRoles.length === totalPlayers) {
            const sameSlots = roles.filter((role, i) =>
                role !== 'civilian' && role === this.lastGameHistory.cardRoles[i]
            ).length;

            if (sameSlots > 0) {
                // If special roles landed in exact same spots, 80% chance to shuffle again
                if (Math.random() < 0.8) {
                    console.log('Breaking card slot streak!');
                    shuffleRoles(roles);
                }
            }
        }

        // 3. Create Players
        const newPlayers: Player[] = Array.from({ length: totalPlayers }).map((_, index) => ({
            id: index,
            name: '',
            role: roles[index],
            picked: false,
            eliminated: false,
            manualName: undefined
        }));

        // SAVE HISTORY for next time
        this.lastGameHistory = {
            starterName: pickingOrder[0],
            playerRoles: {}, // We can't track player-to-role here as names aren't assigned yet
            cardRoles: [...roles]
        };

        // 4. Generate Words (ONLY ONCE)
        let words: WordPair | null = null;

        if (selectedCustomPacks.length > 0) {
            // EQUAL PROBABILITY SELECTION:
            // Step 1: Randomly pick a pack
            const randomPackIndex = Math.floor(Math.random() * selectedCustomPacks.length);
            const selectedPack = selectedCustomPacks[randomPackIndex];

            // Step 2: Use History Service to get a non-repeating word
            words = await WordHistoryService.getUnusedWord(selectedPack.id, selectedPack.words);

            // Fire and forget play count increment
            PackService.incrementPackPlays(selectedPack.id);
        } else {
            try {
                const result = await generateWordPair(mode);
                if (result.success && result.wordPair) {
                    words = result.wordPair;
                } else {
                    // Fallback to static words using History Service
                    const staticList = mode === 'spicy' ? SPICY_STATIC_WORD_PAIRS : STATIC_WORD_PAIRS;
                    const staticId = mode === 'spicy' ? STATIC_PACK_ID_SPICY : STATIC_PACK_ID_STANDARD;

                    words = await WordHistoryService.getUnusedWord(staticId, staticList);
                }
            } catch (e) {
                // Final fallback
                const staticList = mode === 'spicy' ? SPICY_STATIC_WORD_PAIRS : STATIC_WORD_PAIRS;
                const staticId = mode === 'spicy' ? STATIC_PACK_ID_SPICY : STATIC_PACK_ID_STANDARD;
                words = await WordHistoryService.getUnusedWord(staticId, staticList);
            }
        }

        // Just in case (should not happen due to auto-reshuffle), use simple random
        if (!words) {
            const fallbackList = mode === 'spicy' ? SPICY_STATIC_WORD_PAIRS : STATIC_WORD_PAIRS;
            words = fallbackList[Math.floor(Math.random() * fallbackList.length)];
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

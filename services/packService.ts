import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, increment, query, orderBy, limit } from 'firebase/firestore';
import { WordPair } from './wordGenerator';

export interface WordPack {
    id: string;
    name: string;
    author: string;
    description: string;
    emoji: string;
    plays: number;
    words: WordPair[]; // Optional in list view, required for game
    isOfficial?: boolean;
}

// NEW STRUCTURE: Split metadata and content
const METADATA_COLLECTION = 'packs_metadata';
const CONTENT_COLLECTION = 'packs_content';
const FLAGGED_COLLECTION = 'flagged_words';

export const PackService = {
    // Fetch ONLY metadata (Lightweight)
    async getAllPacks(): Promise<WordPack[]> {
        try {
            const q = query(collection(db, METADATA_COLLECTION), orderBy('plays', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                words: [] // Empty words initially to keep interface happy
            } as WordPack));
        } catch (e) {
            console.error("Error fetching packs:", e);
            return [];
        }
    },

    // Fetch Words for a specific pack (Heavy)
    async getPackContent(packId: string): Promise<WordPair[]> {
        try {
            const docRef = doc(db, CONTENT_COLLECTION, packId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().words as WordPair[];
            }
            return [];
        } catch (e) {
            console.error("Error fetching pack content:", e);
            return [];
        }
    },

    // Create a new pack (Writes to BOTH collections)
    async createPack(pack: Omit<WordPack, 'id' | 'plays'>): Promise<string | null> {
        try {
            // 1. Create Auto-ID for Metadata
            const metaRef = doc(collection(db, METADATA_COLLECTION));
            const packId = metaRef.id;

            // 2. Write Metadata (Exclude words)
            const { words, ...metadata } = pack;
            await setDoc(metaRef, {
                ...metadata,
                plays: 0,
                createdAt: new Date(),
                totalWords: words.length // Store count for UI
            });

            // 3. Write Content (Words only) using SAME ID
            await setDoc(doc(db, CONTENT_COLLECTION, packId), {
                words: words
            });

            return packId;
        } catch (e) {
            console.error("Error creating pack:", e);
            return null;
        }
    },

    // Increment play count
    async incrementPackPlays(packId: string) {
        try {
            const ref = doc(db, METADATA_COLLECTION, packId);
            await updateDoc(ref, {
                plays: increment(1)
            });
        } catch (e) {
            // Low priority error
        }
    },

    // Report a bad word pair
    async reportBadWord(wordPair: WordPair, reason: string) {
        try {
            await setDoc(doc(collection(db, FLAGGED_COLLECTION)), {
                civilian: wordPair.civilian,
                undercover: wordPair.undercover,
                reason,
                timestamp: new Date()
            });
        } catch (e) {
            console.error("Error reporting word:", e);
        }
    }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PACKS, LocalPack } from '../data/defaultPacks';

const PACKS_STORAGE_KEY = '@mimic_packs';
const VERSIONS_STORAGE_KEY = '@mimic_pack_versions';

export const LocalPackStorage = {
    // Initialize: Load defaults into storage if first run
    async initialize(): Promise<LocalPack[]> {
        try {
            const stored = await AsyncStorage.getItem(PACKS_STORAGE_KEY);

            if (!stored) {
                // First run: Save defaults to storage
                await AsyncStorage.setItem(PACKS_STORAGE_KEY, JSON.stringify(DEFAULT_PACKS));
                return DEFAULT_PACKS;
            }

            return JSON.parse(stored) as LocalPack[];
        } catch (e) {
            console.error('Error initializing packs:', e);
            return DEFAULT_PACKS; // Fallback to hardcoded
        }
    },

    // Get all local packs (INSTANT - no network)
    async getAllPacks(): Promise<LocalPack[]> {
        try {
            const stored = await AsyncStorage.getItem(PACKS_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored) as LocalPack[];
            }
            return DEFAULT_PACKS;
        } catch (e) {
            return DEFAULT_PACKS;
        }
    },

    // Get a specific pack by ID
    async getPackById(packId: string): Promise<LocalPack | null> {
        const packs = await this.getAllPacks();
        return packs.find(p => p.id === packId) || null;
    },

    // Save updated pack (used by background sync)
    async updatePack(updatedPack: LocalPack): Promise<void> {
        try {
            const packs = await this.getAllPacks();
            const index = packs.findIndex(p => p.id === updatedPack.id);

            if (index !== -1) {
                packs[index] = updatedPack;
            } else {
                packs.push(updatedPack);
            }

            await AsyncStorage.setItem(PACKS_STORAGE_KEY, JSON.stringify(packs));
        } catch (e) {
            console.error('Error updating pack:', e);
        }
    },

    // Get stored version for a pack
    async getStoredVersion(packId: string): Promise<number> {
        try {
            const versions = await AsyncStorage.getItem(VERSIONS_STORAGE_KEY);
            if (versions) {
                const parsed = JSON.parse(versions);
                return parsed[packId] || 0;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    },

    // Save version after update
    async saveVersion(packId: string, version: number): Promise<void> {
        try {
            const versions = await AsyncStorage.getItem(VERSIONS_STORAGE_KEY);
            const parsed = versions ? JSON.parse(versions) : {};
            parsed[packId] = version;
            await AsyncStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) {
            console.error('Error saving version:', e);
        }
    },

    // Clear all cached packs (for debugging)
    async clearCache(): Promise<void> {
        await AsyncStorage.removeItem(PACKS_STORAGE_KEY);
        await AsyncStorage.removeItem(VERSIONS_STORAGE_KEY);
    }
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'undercover_groups';

export interface PlayerGroup {
    id: string;
    name: string;
    emoji: string;
    players: string[];
    color: string; // New field for group color
    createdAt: number;
    lastPlayedAt: number | null;
}

const EMOJIS = ['⚡', '🎮', '🔥', '💫', '🌟', '🎯', '🚀', '💎', '🌙', '🎪'];
const COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#84cc16', // Lime
    '#22c55e', // Green
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#d946ef', // Fuchsia
    '#f43f5e', // Rose
];

export async function getGroups(): Promise<PlayerGroup[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export async function getGroupById(id: string): Promise<PlayerGroup | undefined> {
    const groups = await getGroups();
    return groups.find(g => g.id === id);
}

export async function saveGroups(groups: PlayerGroup[]): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (e) {
        console.error('Failed to save groups:', e);
    }
}

export async function createGroup(name: string, players: string[]): Promise<PlayerGroup> {
    const groups = await getGroups();

    const newGroup: PlayerGroup = {
        id: Date.now().toString(),
        name: name.trim(),
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        players: players,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        createdAt: Date.now(),
        lastPlayedAt: null
    };

    groups.push(newGroup);
    await saveGroups(groups);

    return newGroup;
}

export async function updateGroup(groupId: string, updates: Partial<PlayerGroup>): Promise<void> {
    const groups = await getGroups();
    const index = groups.findIndex(g => g.id === groupId);

    if (index !== -1) {
        groups[index] = { ...groups[index], ...updates };
        await saveGroups(groups);
    }
}

export async function deleteGroup(groupId: string): Promise<void> {
    const groups = await getGroups();
    const filtered = groups.filter(g => g.id !== groupId);
    await saveGroups(filtered);
}

export async function markGroupPlayed(groupId: string): Promise<void> {
    await updateGroup(groupId, { lastPlayedAt: Date.now() });
}

export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getRandomColor(): string {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

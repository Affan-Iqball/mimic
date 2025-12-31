import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Play } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { LocalPackStorage } from '../../services/localPackStorage';
import { LocalPack } from '../../data/defaultPacks';
import { GameService } from '../../services/gameService';

export default function WordPacksScreen() {
    const router = useRouter();
    const [packs, setPacks] = useState<LocalPack[]>([]);
    const [loading, setLoading] = useState(true);
    // Support multiple selection
    const [selectedPackIds, setSelectedPackIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadPacks();
    }, []);

    const loadPacks = async () => {
        setLoading(true);
        // INSTANT: Load from local storage/hardcoded defaults
        const data = await LocalPackStorage.initialize();
        setPacks(data);

        // Check current selection from GameService
        const currentPacks = GameService.getSelectedPacks();
        if (currentPacks.length > 0) {
            setSelectedPackIds(new Set(currentPacks.map(p => p.id)));
        } else {
            // Default: select the first pack (Standard Core)
            if (data.length > 0) {
                setSelectedPackIds(new Set([data[0].id]));
                GameService.addCustomPack({
                    id: data[0].id,
                    name: data[0].name,
                    author: data[0].author,
                    description: data[0].description,
                    emoji: data[0].emoji,
                    plays: 0,
                    words: data[0].words,
                    isOfficial: data[0].isOfficial
                });
            }
        }

        setLoading(false);
    };

    const togglePackSelection = (pack: LocalPack) => {
        const newSelection = new Set(selectedPackIds);

        if (newSelection.has(pack.id)) {
            // Deselect - but must have at least 1 pack selected
            if (newSelection.size > 1) {
                newSelection.delete(pack.id);
                GameService.removeCustomPack(pack.id);
            } else {
                Alert.alert("Cannot Deselect", "You must have at least one pack selected.");
                return;
            }
        } else {
            // Select
            newSelection.add(pack.id);
            GameService.addCustomPack({
                id: pack.id,
                name: pack.name,
                author: pack.author,
                description: pack.description,
                emoji: pack.emoji,
                plays: 0,
                words: pack.words,
                isOfficial: pack.isOfficial
            });
        }

        setSelectedPackIds(newSelection);
    };

    const getTotalWords = () => {
        return packs
            .filter(p => selectedPackIds.has(p.id))
            .reduce((sum, p) => sum + p.words.length, 0);
    };

    const handleConfirm = () => {
        const selectedCount = selectedPackIds.size;
        const totalWords = getTotalWords();
        Alert.alert(
            `${selectedCount} Pack${selectedCount > 1 ? 's' : ''} Selected! ✓`,
            `${totalWords} word pairs ready.\n\n${selectedCount > 1 ? '⚖️ Each pack has equal probability!' : ''}`,
            [{ text: "Let's Play!", onPress: () => router.back() }]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ width: 40, height: 40, backgroundColor: '#1a1a1a', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>Word Packs</Text>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    onPress={handleConfirm}
                    style={{ backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                    <Check size={18} color="white" strokeWidth={3} />
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Done</Text>
                </TouchableOpacity>
            </View>

            {/* Selection Info */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                <View style={{ backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <Text style={{ color: '#71717a', fontSize: 12, marginBottom: 4 }}>SELECTED</Text>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                        {selectedPackIds.size} Pack{selectedPackIds.size !== 1 ? 's' : ''} • {getTotalWords()} Words
                    </Text>
                    {selectedPackIds.size > 1 && (
                        <Text style={{ color: '#22c55e', fontSize: 12, marginTop: 4 }}>
                            ⚖️ Each pack has equal probability of being picked
                        </Text>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#22c55e" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                    <Text style={{ color: '#71717a', fontSize: 12, marginBottom: 12 }}>
                        TAP TO SELECT/DESELECT PACKS
                    </Text>
                    {packs.map((pack) => {
                        const isSelected = selectedPackIds.has(pack.id);
                        return (
                            <TouchableOpacity
                                key={pack.id}
                                onPress={() => togglePackSelection(pack)}
                                activeOpacity={0.7}
                                style={{
                                    marginBottom: 16,
                                    backgroundColor: isSelected ? '#22c55e10' : '#1a1a1a',
                                    borderRadius: 20,
                                    padding: 20,
                                    borderWidth: 2,
                                    borderColor: isSelected ? '#22c55e' : '#262626'
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{pack.emoji} {pack.name}</Text>
                                    {isSelected && (
                                        <View style={{ width: 24, height: 24, backgroundColor: '#22c55e', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                                            <Check size={14} color="white" strokeWidth={3} />
                                        </View>
                                    )}
                                </View>

                                <Text style={{ color: '#a1a1aa', fontSize: 14, marginBottom: 12 }}>
                                    {pack.description}
                                </Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ backgroundColor: '#3f3f46', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                            <Text style={{ color: '#71717a', fontSize: 11 }}>{pack.words.length} pairs</Text>
                                        </View>
                                        {pack.isOfficial && (
                                            <View style={{ backgroundColor: '#2563eb20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                                <Text style={{ color: '#3b82f6', fontSize: 11, fontWeight: 'bold' }}>OFFICIAL</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={{ color: isSelected ? '#22c55e' : '#71717a', fontSize: 12, fontWeight: 'bold' }}>
                                        {isSelected ? '✓ Selected' : 'Tap to add'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
}

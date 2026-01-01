import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { GameService } from '../../services/gameService';
import { Info } from 'lucide-react-native';
import { wordDefinitions } from '../../data/wordDefinitions';

export default function RevealRole() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const playerIndex = Number(params.playerIndex);

    // Read state from service directly
    const state = GameService.getState();
    const player = state.players[playerIndex];

    // Get the current picker's name from pickingOrder
    const currentPickerName = state.pickingOrder[state.currentPickerIndex] || `Player ${playerIndex + 1}`;

    if (!player || !state.wordPair) {
        // Safety check if state is missing
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Error loading player data</Text>
                <TouchableOpacity onPress={() => router.back()}><Text style={{ color: 'red', marginTop: 20 }}>Go Back</Text></TouchableOpacity>
            </View>
        );
    }

    const { role } = player;

    // Always start at 'hidden' step - no naming needed since we use pickingOrder
    const [step, setStep] = useState<'hidden' | 'reveal'>('hidden');

    const getSecretWord = () => {
        if (role === 'civilian') return state.wordPair?.civilian;
        if (role === 'undercover') return state.wordPair?.undercover;
        return null;
    };

    const getRoleEmoji = () => {
        if (role === 'undercover') return '🕵️';
        if (role === 'mrwhite') return '👻';
        return '👤';
    };

    const getRoleColor = () => {
        if (role === 'mrwhite') return '#71717a';
        if (role === 'undercover') return '#fbbf24';
        return '#22c55e';
    };

    const handleDone = () => {
        // Mark card as picked (this also assigns the picker's name and advances the index)
        GameService.markCardPicked(playerIndex);

        // Navigate BACK safely
        router.back();
    };

    // HIDDEN STEP - "No one is looking" screen
    if (step === 'hidden') {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View entering={FadeIn} style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>{currentPickerName}</Text>
                    <Text style={{ color: '#71717a', fontSize: 15, marginBottom: 40, textAlign: 'center' }}>Make sure no one else is looking! 🤫</Text>

                    <TouchableOpacity
                        onPress={() => setStep('reveal')}
                        style={{ width: 180, height: 240, backgroundColor: '#fbbf24', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 6, borderBottomColor: '#b45309' }}
                    >
                        <Text style={{ fontSize: 40, marginBottom: 12 }}>🤫</Text>
                        <Text style={{ color: '#78350f', fontWeight: 'bold', fontSize: 16 }}>Tap to reveal</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    // REVEAL STEP
    const secretWord = getSecretWord();

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View entering={ZoomIn.duration(300)} style={{ width: '100%', maxWidth: 320, backgroundColor: '#1a1a1a', borderRadius: 28, borderWidth: 1, borderColor: '#2a2a2a', overflow: 'hidden' }}>
                <View style={{ height: 80, backgroundColor: getRoleColor(), justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 }}>
                    <View style={{ position: 'absolute', bottom: -32, borderWidth: 4, borderColor: '#1a1a1a', borderRadius: 40 }}>
                        <View style={{ width: 64, height: 64, backgroundColor: getRoleColor(), borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 28 }}>{getRoleEmoji()}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 20, paddingBottom: 24 }}>
                    <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>{currentPickerName}</Text>
                    <Text style={{ color: '#71717a', fontSize: 13, marginBottom: 20 }}>
                        {role === 'mrwhite' ? 'You have no secret word' : 'Your secret word is...'}
                    </Text>

                    {role === 'mrwhite' ? (
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', width: '100%', marginBottom: 20 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>You are Mr. White 👻</Text>
                            <Text style={{ color: '#71717a', textAlign: 'center', fontSize: 11, marginTop: 8 }}>Figure out the word!</Text>
                        </View>
                    ) : (
                        <View style={{ backgroundColor: role === 'undercover' ? 'rgba(251,191,36,0.1)' : 'rgba(34,197,94,0.1)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: role === 'undercover' ? 'rgba(251,191,36,0.3)' : 'rgba(34,197,94,0.3)', width: '100%', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <Text style={{ color: role === 'undercover' ? '#fbbf24' : '#22c55e', textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>{secretWord}</Text>
                                {secretWord && wordDefinitions[secretWord] && (
                                    <TouchableOpacity
                                        onPress={() => Alert.alert(secretWord, wordDefinitions[secretWord])}
                                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 6, borderRadius: 12 }}
                                    >
                                        <Info size={20} color={role === 'undercover' ? '#fbbf24' : '#22c55e'} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {role === 'undercover' && <Text style={{ color: '#fbbf24', textAlign: 'center', fontSize: 11, marginTop: 8, opacity: 0.7 }}>You're undercover! 🕵️</Text>}
                        </View>
                    )}

                    <TouchableOpacity onPress={handleDone} style={{ width: '100%', backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 20 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Got it! ✓</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

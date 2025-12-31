import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { GameService } from '../../services/gameService';
import { Info } from 'lucide-react-native';
import { wordDefinitions } from '../../data/wordDefinitions';

function formatName(name: string): string {
    return name.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export default function RevealRole() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const playerIndex = Number(params.playerIndex);

    // Read state from service directly
    const state = GameService.getState();
    const player = state.players[playerIndex];

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
    // If player has a manual name or pre-filled name, use it
    const prefilledName = player.manualName;

    const hasPrefilled = !!prefilledName;

    const [step, setStep] = useState<'naming' | 'hidden' | 'reveal'>(hasPrefilled ? 'hidden' : 'naming');
    const [name, setName] = useState(prefilledName || '');
    const [nameError, setNameError] = useState<string | null>(null);

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

    const handleNameChange = (text: string) => {
        setName(text.slice(0, 15));
        setNameError(null);
    };

    const validateAndContinue = () => {
        const formattedName = formatName(name);
        if (!formattedName) {
            setNameError('Please enter a name');
            return;
        }

        // Check duplicates in OTHER players
        const isDuplicate = state.players.some((p, idx) => idx !== playerIndex && p.name.toLowerCase() === formattedName.toLowerCase());

        if (isDuplicate) {
            setNameError('This name is already taken!');
            return;
        }

        setName(formattedName);
        setStep('hidden');
    };

    const handleDone = () => {
        const finalName = hasPrefilled ? prefilledName : formatName(name);

        // UPDATE SERVICE STATE
        if (finalName && !hasPrefilled) {
            GameService.updatePlayerName(playerIndex, finalName);
        }
        GameService.markCardPicked(playerIndex);

        // Navigate BACK safely
        router.back();
    };

    // NAMING STEP
    if (step === 'naming') {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View entering={ZoomIn.springify()} style={{ width: '100%', maxWidth: 320, backgroundColor: '#1a1a1a', padding: 28, borderRadius: 28, borderWidth: 1, borderColor: '#2a2a2a', alignItems: 'center' }}>
                    <View style={{ width: 80, height: 80, backgroundColor: '#22c55e', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: '#0a0a0a' }}>
                        <Text style={{ color: '#166534', fontSize: 32, fontWeight: 'bold' }}>{name.trim() ? formatName(name)[0] : '?'}</Text>
                    </View>

                    <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Player {playerIndex + 1}</Text>
                    <Text style={{ color: '#71717a', fontSize: 13, marginBottom: 20 }}>Enter your name</Text>

                    <TextInput
                        placeholder="Your name"
                        placeholderTextColor="#52525b"
                        style={{ width: '100%', textAlign: 'center', color: 'white', fontSize: 22, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: nameError ? '#ef4444' : '#3f3f46', paddingBottom: 8, marginBottom: 8 }}
                        value={name}
                        onChangeText={handleNameChange}
                        autoFocus
                        autoCapitalize="words"
                    />

                    {nameError ? (
                        <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 16 }}>{nameError}</Text>
                    ) : (
                        <Text style={{ color: '#52525b', fontSize: 11, marginBottom: 16 }}>{name.trim().length}/15</Text>
                    )}

                    <TouchableOpacity
                        onPress={validateAndContinue}
                        disabled={!name.trim()}
                        style={{ width: '100%', backgroundColor: name.trim() ? '#22c55e' : '#2a2a2a', paddingVertical: 14, borderRadius: 14, opacity: name.trim() ? 1 : 0.5 }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Continue</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    // HIDDEN STEP
    if (step === 'hidden') {
        const displayName = hasPrefilled ? prefilledName : formatName(name);
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View entering={FadeIn} style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>{displayName}</Text>
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
    const displayName = hasPrefilled ? prefilledName : formatName(name);
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
                    <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>{displayName}</Text>
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

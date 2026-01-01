import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Animated, { ZoomIn, FadeIn } from 'react-native-reanimated';
import { GameService, Player } from '../../services/gameService';
import { validateGuess } from '../../services/guessValidator';

export default function EliminatedScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const playerIndex = Number(params.playerIndex);

    const [player, setPlayer] = useState<Player | null>(null);
    const [wordPair, setWordPair] = useState<{ civilian: string; undercover: string } | null>(null);
    const [guess, setGuess] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [guessResult, setGuessResult] = useState<{ correct: boolean; message: string } | null>(null);
    const [showGuess, setShowGuess] = useState(false);

    useEffect(() => {
        const state = GameService.getState();
        const eliminatedPlayer = state.players[playerIndex];
        setPlayer(eliminatedPlayer);
        setWordPair(state.wordPair);

        // Show guess input for spy or mrwhite
        if (eliminatedPlayer?.role === 'undercover' || eliminatedPlayer?.role === 'mrwhite') {
            setShowGuess(true);
        }
    }, [playerIndex]);

    const getRoleInfo = () => {
        if (!player) return { emoji: '👤', label: 'Player', color: '#71717a' };

        switch (player.role) {
            case 'civilian':
                return { emoji: '👤', label: 'Civilian', color: '#22c55e' };
            case 'undercover':
                return { emoji: '🕵️', label: 'Undercover', color: '#fbbf24' };
            case 'mrwhite':
                return { emoji: '👻', label: 'Mr. White', color: '#71717a' };
            default:
                return { emoji: '👤', label: 'Player', color: '#71717a' };
        }
    };

    const handleGuess = async () => {
        if (!guess.trim() || !wordPair) return;

        setIsValidating(true);
        try {
            const result = await validateGuess(guess.trim(), wordPair.civilian);
            setGuessResult({
                correct: result.isCorrect,
                message: result.message || (result.isCorrect ? 'Correct guess!' : 'Wrong guess!')
            });

            if (result.isCorrect) {
                // Infiltrator wins by correct guess!
                setTimeout(() => {
                    router.replace({
                        pathname: '/game/gameover',
                        params: { winner: 'guesser', guesserName: player?.name }
                    });
                }, 2000);
            }
        } catch (error) {
            setGuessResult({ correct: false, message: 'Error validating guess' });
        }
        setIsValidating(false);
    };

    const handleContinue = () => {
        // FINALIZE ELIMINATION:
        // If they were deferred (Infiltrator) and failed guess, or Civilian (already elim),
        // ensure they are marked eliminated now.
        if (player && !player.eliminated) {
            GameService.eliminatePlayer(playerIndex);
        }

        // Check win condition
        const winResult = GameService.checkWinCondition();

        if (winResult) {
            router.replace({
                pathname: '/game/gameover',
                params: { winner: winResult }
            });
        } else {
            // Game continues - go back to discuss
            router.replace('/game/discuss');
        }
    };

    if (!player) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Loading...</Text>
            </View>
        );
    }

    const roleInfo = getRoleInfo();
    const isInfiltrator = player.role === 'undercover' || player.role === 'mrwhite';

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            <Animated.View entering={ZoomIn.springify()} style={{ width: '100%', maxWidth: 340, backgroundColor: '#1a1a1a', borderRadius: 28, overflow: 'hidden', borderWidth: 2, borderColor: roleInfo.color }}>
                {/* Header with role color */}
                <View style={{ height: 100, backgroundColor: roleInfo.color, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 }}>
                    <View style={{ position: 'absolute', bottom: -40, width: 80, height: 80, backgroundColor: roleInfo.color, borderRadius: 40, borderWidth: 4, borderColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 36 }}>{roleInfo.emoji}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={{ alignItems: 'center', paddingTop: 56, paddingHorizontal: 24, paddingBottom: 24 }}>
                    <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 14, letterSpacing: 2, marginBottom: 8 }}>ELIMINATED</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 26, marginBottom: 8 }}>{player.name}</Text>
                    <View style={{ backgroundColor: `${roleInfo.color}20`, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginBottom: 20 }}>
                        <Text style={{ color: roleInfo.color, fontWeight: 'bold', fontSize: 16 }}>{roleInfo.label}</Text>
                    </View>

                    {/* Role Description */}
                    {isInfiltrator && (
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, width: '100%', marginBottom: 20 }}>
                            <Text style={{ color: '#fbbf24', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                                {player.role === 'mrwhite' ? '👻 Mr. White was eliminated!' : '🕵️ Spy was eliminated!'}
                            </Text>
                            <Text style={{ color: '#71717a', textAlign: 'center', fontSize: 12 }}>
                                They get ONE chance to guess the civilian word!
                            </Text>
                        </View>
                    )}

                    {/* Guess Section for infiltrators */}
                    {showGuess && !guessResult && (
                        <Animated.View entering={FadeIn} style={{ width: '100%', marginBottom: 16 }}>
                            <Text style={{ color: '#71717a', fontSize: 12, marginBottom: 8, textAlign: 'center' }}>What's the civilian word?</Text>
                            <TextInput
                                value={guess}
                                onChangeText={setGuess}
                                placeholder="Enter your guess..."
                                placeholderTextColor="#52525b"
                                style={{ backgroundColor: '#0a0a0a', color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 12 }}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={handleGuess} disabled={!guess.trim() || isValidating} style={{ backgroundColor: guess.trim() ? '#fbbf24' : '#2a2a2a', paddingVertical: 14, borderRadius: 16, opacity: guess.trim() && !isValidating ? 1 : 0.5 }}>
                                <Text style={{ color: guess.trim() ? '#78350f' : 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                                    {isValidating ? 'Checking...' : 'Submit Guess'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Guess Result */}
                    {guessResult && (
                        <Animated.View entering={ZoomIn} style={{ width: '100%', backgroundColor: guessResult.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: guessResult.correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }}>
                            <Text style={{ color: guessResult.correct ? '#22c55e' : '#ef4444', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                                {guessResult.correct ? '🎉 Correct!' : '❌ Wrong!'}
                            </Text>
                            <Text style={{ color: '#71717a', textAlign: 'center', fontSize: 12, marginTop: 4 }}>{guessResult.message}</Text>
                        </Animated.View>
                    )}

                    {/* Continue Button */}
                    {(!showGuess || guessResult) && !guessResult?.correct && (
                        <TouchableOpacity onPress={handleContinue} style={{ width: '100%', backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 16 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Continue ✓</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

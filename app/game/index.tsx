import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { GameService, GameState } from '../../services/gameService';

const { width } = Dimensions.get('window');

export default function GameGrid() {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState>(GameService.getState());
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    // Force re-render key - increments each time screen is focused
    const [refreshKey, setRefreshKey] = useState(0);

    // Force update when screen is focused (returning from Reveal)
    useFocusEffect(
        useCallback(() => {
            // Get fresh state from service
            const freshState = GameService.getState();

            // Deep copy to ensure React detects the change
            setGameState({
                isActive: freshState.isActive,
                players: [...freshState.players],
                wordPair: freshState.wordPair,
                totalUndercovers: freshState.totalUndercovers,
                totalMrWhites: freshState.totalMrWhites,
            });

            // Calculate next player index
            const firstUnpickedIndex = freshState.players.findIndex(p => !p.picked);
            setCurrentPlayerIndex(firstUnpickedIndex === -1 ? freshState.players.length : firstUnpickedIndex);

            // Force re-render
            setRefreshKey(k => k + 1);
        }, [])
    );

    // Calculate card size
    const totalPlayers = gameState.players.length;
    const columns = totalPlayers <= 4 ? 2 : totalPlayers <= 9 ? 3 : 4;
    const cardGap = 12;
    const cardWidth = (width - 32 - (columns - 1) * cardGap) / columns;
    const cardHeight = cardWidth * 1.3;

    const handleCardPress = (index: number) => {
        const player = gameState.players[index];
        if (player.picked || !gameState.wordPair) return;

        // Pass minimal info, screen will pull detailed state if needed or params
        router.push({
            pathname: '/game/reveal',
            params: {
                playerIndex: index,
            }
        });
    };

    const remainingCards = gameState.players.filter(p => !p.picked).length;
    const allPicked = remainingCards === 0;

    // If somehow state is empty (reload app etc), redirect to setup
    if (!gameState.isActive) {
        // In real app might want to persist state to storage too
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Redirecting...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 16, paddingTop: 56 }}>
            {/* Header HUD */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ width: 44, height: 44, backgroundColor: '#1a1a1a', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                <View style={{ backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Text style={{ color: '#71717a', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4, textAlign: 'center' }}>HIDDEN</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 14 }}>🕵️</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{gameState.totalUndercovers}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 14 }}>👻</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{gameState.totalMrWhites}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={{ width: 44, height: 44, backgroundColor: '#1a1a1a', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <HelpCircle size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Category Badge */}
            {/* Category Badge - HIDDEN as per feedback */}
            {/* {gameState.wordPair && (
                <View style={{ alignItems: 'center', marginBottom: 6 }}>
                    <View style={{ backgroundColor: '#2a2a2a', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                        <Text style={{ color: '#71717a', fontSize: 11 }}>{gameState.wordPair.category}</Text>
                    </View>
                </View>
            )} */}

            {/* Instruction */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                {allPicked ? (
                    <>
                        <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 20, marginBottom: 4 }}>All players ready! 🎉</Text>
                        <Text style={{ color: '#71717a', fontSize: 14 }}>Start discussing!</Text>
                    </>
                ) : (
                    <>
                        <Text style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: 32, marginBottom: 8, textAlign: 'center' }}>
                            {gameState.players[currentPlayerIndex]?.name || `Player ${currentPlayerIndex + 1}`}
                        </Text>
                        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Pick a card</Text>
                        <Text style={{ color: '#71717a', fontSize: 13, marginTop: 4 }}>{remainingCards} cards remaining</Text>
                    </>
                )}
            </View>

            {/* Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: cardGap, justifyContent: 'center' }}>
                {gameState.players.map((player, index) => (
                    <Animated.View key={index} entering={ZoomIn.delay(index * 50).springify()} style={{ width: cardWidth, height: cardHeight }}>
                        {player.picked ? (
                            <View style={{ width: '100%', height: '100%', backgroundColor: '#22c55e', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#16a34a' }}>
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '900', textAlign: 'center', paddingHorizontal: 4 }}>{player.name}</Text>
                                <Text style={{ color: 'white', fontSize: 24, fontWeight: '900', marginTop: 4 }}>✓</Text>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => handleCardPress(index)} activeOpacity={0.7} style={{ width: '100%', height: '100%', backgroundColor: '#fbbf24', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#b45309' }}>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.3)', padding: 10, borderRadius: 999 }}>
                                    <Text style={{ fontSize: 20 }}>❓</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                ))}
            </View>

            {/* Start Discussion - redirects to game loop (or setup for now) */}
            {allPicked && (
                <Animated.View entering={FadeIn} style={{ marginTop: 24, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.replace('/game/discuss')} style={{ backgroundColor: '#22c55e', paddingHorizontal: 36, paddingVertical: 14, borderRadius: 999 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Start Discussion 💬</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { GameService, Player } from '../../services/gameService';
import { ArrowLeft, UserX, MessageCircle } from 'lucide-react-native';

export default function VoteScreen() {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);

    useFocusEffect(
        useCallback(() => {
            const state = GameService.getState();
            // Only show non-eliminated players
            const activePlayers = state.players.filter(p => !p.eliminated);
            setPlayers(activePlayers);
        }, [])
    );

    const handleEliminate = (player: Player) => {
        Alert.alert(
            '🗳️ Confirm Elimination',
            `Are you sure you want to eliminate ${player.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Eliminate',
                    style: 'destructive',
                    onPress: () => {
                        // Find original index in full player list
                        const state = GameService.getState();
                        const originalIndex = state.players.findIndex(p => p.id === player.id);

                        if (originalIndex !== -1) {
                            GameService.eliminatePlayer(originalIndex);
                            router.push({
                                pathname: '/game/eliminated',
                                params: { playerIndex: originalIndex }
                            });
                        }
                    }
                }
            ]
        );
    };

    const handleDescribeAgain = () => {
        router.back();
    };

    if (players.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingTop: 56 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 24 }}>
                <TouchableOpacity onPress={handleDescribeAgain} style={{ width: 44, height: 44, backgroundColor: '#1a1a1a', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 20 }}>🗳️ Elimination Time</Text>
                    <Text style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>Vote to eliminate a player</Text>
                </View>

                <View style={{ width: 44 }} />
            </View>

            {/* Info Card */}
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 16, padding: 16 }}>
                    <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>⚠️ Choose wisely!</Text>
                    <Text style={{ color: '#71717a', fontSize: 12 }}>Tap a player card to eliminate them. Find the infiltrators!</Text>
                </View>
            </View>

            {/* Player List */}
            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
                <Text style={{ color: '#71717a', fontSize: 12, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 }}>PLAYERS ({players.length} remaining)</Text>

                {players.map((player, index) => (
                    <Animated.View key={player.id} entering={FadeInDown.delay(index * 50)}>
                        <TouchableOpacity onPress={() => handleEliminate(player)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a' }}>
                            <View style={{ width: 48, height: 48, backgroundColor: '#2a2a2a', borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                                <Text style={{ fontSize: 22 }}>👤</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{player.name}</Text>
                                <Text style={{ color: '#71717a', fontSize: 12, marginTop: 2 }}>Tap to eliminate</Text>
                            </View>
                            <View style={{ backgroundColor: '#ef4444', padding: 10, borderRadius: 12 }}>
                                <UserX size={20} color="white" />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>

            {/* Describe Again Button */}
            <View style={{ padding: 16 }}>
                <TouchableOpacity onPress={handleDescribeAgain} style={{ backgroundColor: '#1a1a1a', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <MessageCircle size={20} color="#fbbf24" />
                    <Text style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 16 }}>Describe Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

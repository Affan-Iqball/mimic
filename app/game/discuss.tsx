import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import Animated, { FadeIn, ZoomIn, FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { GameService, Player } from '../../services/gameService';
import { ArrowLeft, MessageCircle, Vote } from 'lucide-react-native';

export default function DiscussScreen() {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentSpeaker, setCurrentSpeaker] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const state = GameService.getState();
            // Filter out eliminated players for discussion
            const activePlayers = state.players.filter(p => !p.eliminated);
            setPlayers(activePlayers);
            setCurrentSpeaker(0);
        }, [])
    );

    const handleNextSpeaker = () => {
        if (currentSpeaker < players.length - 1) {
            setCurrentSpeaker(currentSpeaker + 1);
        }
    };

    const handlePreviousSpeaker = () => {
        if (currentSpeaker > 0) {
            setCurrentSpeaker(currentSpeaker - 1);
        }
    };

    const handleGoToVote = () => {
        router.push('/game/vote');
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
                <TouchableOpacity onPress={() => router.back()} style={{ width: 44, height: 44, backgroundColor: '#1a1a1a', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 20 }}>💬 Description Time</Text>
                    <Text style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>Describe your word without saying it!</Text>
                </View>

                <View style={{ width: 44 }} />
            </View>

            {/* Discussion Info Card */}
            <Animated.View entering={ZoomIn} style={{ flex: 1, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#1a1a1a', borderRadius: 24, padding: 32, width: '100%', maxWidth: 340, borderWidth: 2, borderColor: '#fbbf24', alignItems: 'center' }}>
                    <View style={{ width: 100, height: 100, backgroundColor: '#fbbf24', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                        <Text style={{ fontSize: 48 }}>💬</Text>
                    </View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginBottom: 8, textAlign: 'center' }}>Time to Discuss!</Text>
                    <Text style={{ color: '#71717a', fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
                        Take turns describing your word.{'\n'}Don't say the word itself!
                    </Text>
                    <View style={{ backgroundColor: 'rgba(251,191,36,0.1)', padding: 16, borderRadius: 16, marginTop: 20, width: '100%' }}>
                        <Text style={{ color: '#fbbf24', fontSize: 13, textAlign: 'center' }}>
                            🎯 {players.length} players remaining
                        </Text>
                    </View>
                </View>
            </Animated.View>

            {/* SPEAKING ORDER - Hidden for now, keeping code for future use */}
            {/* 
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                <Text style={{ color: '#71717a', fontSize: 12, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 }}>SPEAKING ORDER</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {players.map((player, index) => (
                        <Animated.View key={player.id} entering={FadeInDown.delay(index * 50)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: index === currentSpeaker ? 'rgba(251,191,36,0.1)' : '#1a1a1a', padding: 14, borderRadius: 16, marginBottom: 8, borderWidth: index === currentSpeaker ? 2 : 1, borderColor: index === currentSpeaker ? '#fbbf24' : '#2a2a2a' }}>
                            <View style={{ width: 32, height: 32, backgroundColor: index < currentSpeaker ? '#22c55e' : index === currentSpeaker ? '#fbbf24' : '#2a2a2a', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{index < currentSpeaker ? '✓' : index + 1}</Text>
                            </View>
                            <Text style={{ color: index === currentSpeaker ? '#fbbf24' : index < currentSpeaker ? '#22c55e' : 'white', fontWeight: index === currentSpeaker ? 'bold' : 'normal', fontSize: 16 }}>{player.name}</Text>
                            {index === currentSpeaker && (
                                <View style={{ marginLeft: 'auto', backgroundColor: '#fbbf24', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                    <Text style={{ color: '#78350f', fontWeight: 'bold', fontSize: 11 }}>SPEAKING</Text>
                                </View>
                            )}
                        </Animated.View>
                    ))}
                </ScrollView>
            </View>

            <View style={{ padding: 16, gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={handlePreviousSpeaker} disabled={currentSpeaker === 0} style={{ flex: 1, backgroundColor: currentSpeaker === 0 ? '#2a2a2a' : '#1a1a1a', paddingVertical: 14, borderRadius: 16, opacity: currentSpeaker === 0 ? 0.5 : 1, borderWidth: 1, borderColor: '#2a2a2a' }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>← Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextSpeaker} disabled={currentSpeaker >= players.length - 1} style={{ flex: 1, backgroundColor: currentSpeaker >= players.length - 1 ? '#2a2a2a' : '#fbbf24', paddingVertical: 14, borderRadius: 16, opacity: currentSpeaker >= players.length - 1 ? 0.5 : 1 }}>
                        <Text style={{ color: currentSpeaker >= players.length - 1 ? 'white' : '#78350f', textAlign: 'center', fontWeight: 'bold' }}>Next →</Text>
                    </TouchableOpacity>
                </View>
            */}

            {/* Go to Vote Button */}
            <View style={{ padding: 16 }}>
                <TouchableOpacity onPress={handleGoToVote} style={{ backgroundColor: '#ef4444', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                    <Vote size={20} color="white" />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Go to Vote</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

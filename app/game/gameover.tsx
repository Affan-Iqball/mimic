import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Animated, { ZoomIn, FadeInDown, FadeIn } from 'react-native-reanimated';
import { GameService, Player } from '../../services/gameService';
import { Home, RotateCcw } from 'lucide-react-native';

export default function GameOverScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const winner = params.winner as string;
    const guesserName = params.guesserName as string | undefined;

    const [players, setPlayers] = useState<Player[]>([]);
    const [wordPair, setWordPair] = useState<{ civilian: string; undercover: string } | null>(null);
    const [stats, setStats] = useState({ undercovers: 0, mrWhites: 0 });

    useEffect(() => {
        const state = GameService.getState();
        setPlayers(state.players);
        setWordPair(state.wordPair);
        setStats({
            undercovers: state.totalUndercovers,
            mrWhites: state.totalMrWhites
        });
    }, []);

    const getWinnerInfo = () => {
        switch (winner) {
            case 'civilians':
                return {
                    emoji: '🎉',
                    title: 'Civilians Win!',
                    subtitle: 'All infiltrators have been eliminated!',
                    color: '#22c55e'
                };
            case 'infiltrators':
                return {
                    emoji: '🕵️',
                    title: 'Infiltrators Win!',
                    subtitle: 'Only one civilian remains!',
                    color: '#fbbf24'
                };
            case 'guesser':
                return {
                    emoji: '🏆',
                    title: `${guesserName || 'Infiltrator'} Wins!`,
                    subtitle: 'Correctly guessed the civilian word!',
                    color: '#8b5cf6'
                };
            default:
                return {
                    emoji: '🎮',
                    title: 'Game Over',
                    subtitle: '',
                    color: '#71717a'
                };
        }
    };

    const getRoleStyle = (role: string) => {
        switch (role) {
            case 'civilian':
                return { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', emoji: '👤' };
            case 'undercover':
                return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', emoji: '🕵️' };
            case 'mrwhite':
                return { color: '#71717a', bg: 'rgba(113,113,122,0.1)', emoji: '👻' };
            default:
                return { color: '#71717a', bg: 'rgba(113,113,122,0.1)', emoji: '👤' };
        }
    };

    const handlePlayAgain = () => {
        // Get the group ID before resetting
        const groupId = GameService.getLastGroupId();
        GameService.resetGame();

        // Navigate to setup with the same group if one was used
        if (groupId) {
            router.replace({
                pathname: '/setup',
                params: { groupId }
            });
        } else {
            router.replace('/setup');
        }
    };

    const handleHome = () => {
        GameService.resetGame();
        GameService.setLastGroupId(null); // Clear group on going home
        router.replace('/');
    };

    const winnerInfo = getWinnerInfo();

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
            <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 100, paddingHorizontal: 16 }}>
                {/* Winner Announcement */}
                <Animated.View entering={ZoomIn.springify()} style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ width: 100, height: 100, backgroundColor: winnerInfo.color, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: winnerInfo.color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20 }}>
                        <Text style={{ fontSize: 48 }}>{winnerInfo.emoji}</Text>
                    </View>
                    <Text style={{ color: winnerInfo.color, fontWeight: 'bold', fontSize: 32, textAlign: 'center', marginBottom: 8 }}>{winnerInfo.title}</Text>
                    <Text style={{ color: '#71717a', fontSize: 16, textAlign: 'center' }}>{winnerInfo.subtitle}</Text>
                </Animated.View>

                {/* Word Reveal */}
                {wordPair && (
                    <Animated.View entering={FadeIn.delay(300)} style={{ backgroundColor: '#1a1a1a', borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#2a2a2a' }}>
                        <Text style={{ color: '#71717a', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center', marginBottom: 16 }}>THE WORDS WERE</Text>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            {/* Always show Civilian Word */}
                            <View style={{ flex: 1, backgroundColor: 'rgba(34,197,94,0.1)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', alignItems: 'center' }}>
                                <Text style={{ color: '#71717a', fontSize: 11, marginBottom: 4 }}>CIVILIAN</Text>
                                <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 18 }}>{wordPair.civilian}</Text>
                            </View>

                            {/* Show Undercover only if undercovers exist */}
                            {stats.undercovers > 0 && (
                                <View style={{ flex: 1, backgroundColor: 'rgba(251,191,36,0.1)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)', alignItems: 'center' }}>
                                    <Text style={{ color: '#71717a', fontSize: 11, marginBottom: 4 }}>UNDERCOVER</Text>
                                    <Text style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 18 }}>{wordPair.undercover}</Text>
                                </View>
                            )}

                            {/* Show Mr. White only if Mr. White exists AND NO undercovers (to balance the layout, or as requested) */}
                            {/* User said: "if thier is only mr white it shows mr white" */}
                            {stats.undercovers === 0 && stats.mrWhites > 0 && (
                                <View style={{ flex: 1, backgroundColor: 'rgba(113,113,122,0.1)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(113,113,122,0.3)', alignItems: 'center' }}>
                                    <Text style={{ color: '#71717a', fontSize: 11, marginBottom: 4 }}>MR. WHITE</Text>
                                    <Text style={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: 18 }}>???</Text>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                )}

                {/* Player List with Roles */}
                <Animated.View entering={FadeIn.delay(500)} style={{ backgroundColor: '#1a1a1a', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#2a2a2a' }}>
                    <Text style={{ color: '#71717a', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16 }}>PLAYERS & ROLES</Text>

                    {players.map((player, index) => {
                        const roleStyle = getRoleStyle(player.role);
                        return (
                            <Animated.View key={player.id} entering={FadeInDown.delay(600 + index * 80)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: roleStyle.bg, padding: 14, borderRadius: 14, marginBottom: 8 }}>
                                <View style={{ width: 40, height: 40, backgroundColor: `${roleStyle.color}30`, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                    <Text style={{ fontSize: 20 }}>{roleStyle.emoji}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{player.name}</Text>
                                    <Text style={{ color: roleStyle.color, fontSize: 12, textTransform: 'capitalize' }}>{player.role === 'mrwhite' ? 'Mr. White' : player.role}</Text>
                                </View>
                                {player.eliminated && (
                                    <View style={{ backgroundColor: 'rgba(239,68,68,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                        <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: 'bold' }}>ELIMINATED</Text>
                                    </View>
                                )}
                            </Animated.View>
                        );
                    })}
                </Animated.View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderTopColor: '#1a1a1a' }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={handleHome} style={{ flex: 1, backgroundColor: '#1a1a1a', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#2a2a2a' }}>
                        <Home size={20} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePlayAgain} style={{ flex: 1, backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                        <RotateCcw size={20} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Play Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

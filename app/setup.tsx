import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Users, Plus, Minus, Settings, HelpCircle, X, Edit2 } from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Slider from '@react-native-community/slider';
import { markGroupPlayed, getGroupById } from '../services/groupsService';
import { GameService } from '../services/gameService';
import { useFocusEffect } from 'expo-router';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;

export default function GameSetup() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Params from selection
    const [groupId, setGroupId] = useState<string | null>(params.groupId as string || null);
    const [groupName, setGroupName] = useState(params.groupName as string || '');
    const [groupPlayers, setGroupPlayers] = useState<string[]>(params.groupPlayers ? JSON.parse(params.groupPlayers as string) : []);
    const [groupColor, setGroupColor] = useState(params.groupColor as string || '#22c55e');

    const hasGroup = !!groupId;

    const [players, setPlayers] = useState(5);
    const [undercovers, setUndercovers] = useState(1);
    const [mrWhites, setMrWhites] = useState(0);
    const [isSpicy, setIsSpicy] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    const [selectedPackName, setSelectedPackName] = useState<string | null>(null);

    // Reload group data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (groupId) {
                refreshGroupData(groupId);
            }

            // Check for selected pack
            const pack = GameService.getSelectedPack();
            setSelectedPackName(pack ? pack.name : null);
        }, [groupId])
    );

    const refreshGroupData = async (id: string) => {
        const g = await getGroupById(id);
        if (g) {
            setGroupName(g.name + ' ' + g.emoji);
            setGroupPlayers(g.players);
            setGroupColor(g.color || '#22c55e');
            setPlayers(g.players.length);
        }
    };

    const civilians = players - undercovers - mrWhites;
    const isValid = (undercovers > 0 || mrWhites > 0) && civilians >= 1;

    useEffect(() => {
        if (hasGroup) {
            setPlayers(groupPlayers.length);
        }
    }, [hasGroup, groupPlayers]);

    useEffect(() => {
        if (players < MIN_PLAYERS) return;
        const maxRoles = players - 1;
        if (undercovers + mrWhites > maxRoles) {
            if (undercovers > maxRoles) {
                setUndercovers(maxRoles);
                setMrWhites(0);
            } else {
                setMrWhites(maxRoles - undercovers);
            }
        }
    }, [players]);

    const adjustRole = (role: 'undercover' | 'mrwhite', delta: number) => {
        if (role === 'undercover') {
            const newVal = undercovers + delta;
            if (newVal >= 0 && newVal + mrWhites < players) setUndercovers(newVal);
        } else {
            const newVal = mrWhites + delta;
            if (newVal >= 0 && undercovers + newVal < players) setMrWhites(newVal);
        }
    };

    const clearGroup = () => {
        setGroupId(null);
        setGroupPlayers([]);
        setPlayers(5);
    };

    const handleStart = async () => {
        if (!isValid || isInitializing) return;

        setIsInitializing(true);

        if (groupId) {
            await markGroupPlayed(groupId);
        }

        // Store group ID for "Play Again" feature
        GameService.setLastGroupId(groupId);

        // INITIALIZE GAME SERVICE
        // This generates words once and for all for this session
        await GameService.startGame(
            players,
            undercovers,
            mrWhites,
            hasGroup ? groupPlayers : [],
            isSpicy ? 'spicy' : 'standard'
        );

        setIsInitializing(false);

        // Navigate to Game Grid
        router.push('/game');
    };

    const editGroup = () => {
        if (groupId) {
            router.push({ pathname: '/groups/edit', params: { id: groupId } });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 100 }}>

                {!hasGroup && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <TouchableOpacity onPress={() => router.push('/groups')} style={{ alignItems: 'center' }}>
                            <View style={{ width: 48, height: 48, backgroundColor: '#3b82f6', borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
                                <Users size={22} color="white" />
                            </View>
                            <Text style={{ color: 'white', fontSize: 11, marginTop: 2 }}>Groups</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {hasGroup ? (
                    <View style={{ marginBottom: 24, borderRadius: 24, overflow: 'hidden', backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a' }}>
                        <View style={{ backgroundColor: groupColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 }}>
                            <View>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{groupName}</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{players} players</Text>
                            </View>
                            <TouchableOpacity onPress={clearGroup} style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12 }}>
                                <X size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                            {groupPlayers.slice(0, 5).map((p, i) => (
                                <View key={i} style={{ alignItems: 'center' }}>
                                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: groupColor, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{p[0]}</Text>
                                    </View>
                                    <Text style={{ color: '#71717a', fontSize: 10, width: 44, textAlign: 'center' }} numberOfLines={1}>{p}</Text>
                                </View>
                            ))}
                            {groupPlayers.length > 5 && (
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: 44 }}>
                                    <Text style={{ color: '#71717a', fontSize: 12 }}>+{groupPlayers.length - 5}</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={editGroup}
                            style={{ borderTopWidth: 1, borderTopColor: '#2a2a2a', paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
                        >
                            <Text style={{ color: groupColor, fontWeight: 'bold' }}>Add / Remove Players</Text>
                            <Edit2 size={14} color={groupColor} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
                            Players: {players}
                        </Text>
                        <Slider
                            style={{ width: '100%', height: 36, marginBottom: 20 }}
                            minimumValue={MIN_PLAYERS}
                            maximumValue={MAX_PLAYERS}
                            step={1}
                            value={players}
                            onValueChange={(val) => setPlayers(val)}
                            minimumTrackTintColor="#fbbf24"
                            maximumTrackTintColor="#2a2a2a"
                            thumbTintColor="#fbbf24"
                        />
                    </>
                )}

                {/* Roles Card */}
                <View style={{ backgroundColor: '#1a1a1a', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 16 }}>
                    {/* Civilians */}
                    <View style={{ alignItems: 'center', marginBottom: 14 }}>
                        <View style={{ backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{civilians} Civilians</Text>
                        </View>
                    </View>

                    {/* Undercovers Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <TouchableOpacity
                            onPress={() => adjustRole('undercover', -1)}
                            style={{ width: 32, height: 32, backgroundColor: '#2a2a2a', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Minus size={16} color="white" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginHorizontal: 10, backgroundColor: '#0a0a0a', paddingVertical: 12, borderRadius: 16, borderWidth: 2, borderColor: '#3a3a3a' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{undercovers} Undercovers</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => adjustRole('undercover', 1)}
                            style={{ width: 32, height: 32, backgroundColor: '#2a2a2a', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Plus size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Mr. Whites Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => adjustRole('mrwhite', -1)}
                            style={{ width: 32, height: 32, backgroundColor: '#2a2a2a', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Minus size={16} color="white" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginHorizontal: 10, backgroundColor: '#0a0a0a', paddingVertical: 12, borderRadius: 16, borderWidth: 2, borderColor: '#3a3a3a' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{mrWhites} Mr. Whites</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => adjustRole('mrwhite', 1)}
                            style={{ width: 32, height: 32, backgroundColor: '#2a2a2a', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Plus size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {!isValid && (
                    <View style={{ backgroundColor: '#7f1d1d', borderRadius: 12, padding: 12, marginBottom: 16 }}>
                        <Text style={{ color: '#fca5a5', fontSize: 13, textAlign: 'center' }}>
                            ⚠️ Need at least 1 infiltrator
                        </Text>
                    </View>
                )}
                {/* MERGED: GAME MODES & PACKS BUTTON */}
                <View style={{ width: '100%', marginBottom: 32 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/packs')}
                        style={{
                            width: '100%',
                            backgroundColor: '#1a1a1a',
                            borderRadius: 24,
                            paddingVertical: 20,
                            paddingHorizontal: 24,
                            borderWidth: 1,
                            borderColor: '#333',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <View style={{ width: 48, height: 48, backgroundColor: '#2563eb', borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 24 }}>{selectedPackName === "Standard Mode" || selectedPackName === "AI Generated ✨" ? "☁️" : "📦"}</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Current Pack</Text>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                    {selectedPackName === "AI Generated ✨" ? "Standard / AI" : selectedPackName}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: 32, height: 32, backgroundColor: '#333', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#94a3b8', fontSize: 16 }}>→</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20, backgroundColor: '#0a0a0a', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity style={{ width: 48, height: 48, backgroundColor: '#ec4899', borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
                    <Settings size={22} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleStart}
                    disabled={!isValid || isInitializing}
                    style={{
                        backgroundColor: isValid ? '#22c55e' : '#2a2a2a',
                        paddingHorizontal: 50,
                        paddingVertical: 14,
                        borderRadius: 28,
                        opacity: isValid ? 1 : 0.5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    {isInitializing && <ActivityIndicator size="small" color="white" />}
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                        {isInitializing ? 'Starting...' : 'Start'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/help')}
                    style={{ width: 48, height: 48, backgroundColor: '#3b82f6', borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}
                >
                    <HelpCircle size={22} color="white" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

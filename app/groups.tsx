import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Plus, Trash2, Edit3, UserPlus, Check, ChevronRight } from 'lucide-react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { getGroups, createGroup, deleteGroup, PlayerGroup, formatDate, getRandomColor } from '../services/groupsService';

export default function Groups() {
    const router = useRouter();
    const [groups, setGroups] = useState<PlayerGroup[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newPlayers, setNewPlayers] = useState<string[]>([]);
    const [currentPlayerInput, setCurrentPlayerInput] = useState('');

    // Reload groups whenever screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadGroups();
        }, [])
    );

    const loadGroups = async () => {
        const loadedGroups = await getGroups();
        setGroups(loadedGroups);
    };

    const handleAddPlayer = () => {
        const name = currentPlayerInput.trim();
        if (!name) return;
        const formatted = name.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        if (newPlayers.some(p => p.toLowerCase() === formatted.toLowerCase())) {
            Alert.alert('Duplicate', 'This player is already added!');
            return;
        }
        setNewPlayers([...newPlayers, formatted]);
        setCurrentPlayerInput('');
    };

    const handleRemovePlayer = (index: number) => {
        setNewPlayers(newPlayers.filter((_, i) => i !== index));
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }
        if (newPlayers.length < 3) {
            Alert.alert('Error', 'Add at least 3 players');
            return;
        }

        await createGroup(newGroupName, newPlayers);
        setIsCreating(false);
        setNewGroupName('');
        setNewPlayers([]);
        loadGroups();
    };

    const handleSelectGroup = (group: PlayerGroup) => {
        router.replace({
            pathname: '/setup',
            params: {
                groupId: group.id,
                groupName: group.name,
                groupPlayers: JSON.stringify(group.players),
                groupColor: group.color || getRandomColor()
            }
        });
    };

    const handleEditGroup = (group: PlayerGroup) => {
        router.push({ pathname: '/groups/edit', params: { id: group.id } });
    };

    // Create New Group Form
    if (isCreating) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingTop: 56 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <TouchableOpacity onPress={() => setIsCreating(false)}>
                        <X size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>New Group</Text>
                    <TouchableOpacity onPress={handleCreateGroup}>
                        <Check size={28} color="#22c55e" />
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="Group name (e.g., Squad Goals)"
                    placeholderTextColor="#52525b"
                    style={{ backgroundColor: '#1a1a1a', color: 'white', fontSize: 18, padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a' }}
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                    autoFocus
                />

                <Text style={{ color: '#71717a', fontSize: 14, marginBottom: 12 }}>Players ({newPlayers.length})</Text>

                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <TextInput
                        placeholder="Enter player name"
                        placeholderTextColor="#52525b"
                        style={{ flex: 1, backgroundColor: '#1a1a1a', color: 'white', fontSize: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#2a2a2a' }}
                        value={currentPlayerInput}
                        onChangeText={setCurrentPlayerInput}
                        onSubmitEditing={handleAddPlayer}
                    />
                    <TouchableOpacity
                        onPress={handleAddPlayer}
                        style={{ marginLeft: 8, backgroundColor: '#22c55e', width: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <UserPlus size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1 }}>
                    {newPlayers.map((player, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(index * 50)}
                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a2a' }}
                        >
                            <View style={{ width: 36, height: 36, backgroundColor: '#22c55e', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{player[0]}</Text>
                            </View>
                            <Text style={{ flex: 1, color: 'white', fontSize: 16 }}>{player}</Text>
                            <TouchableOpacity onPress={() => handleRemovePlayer(index)}>
                                <X size={20} color="#71717a" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 30 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Groups</Text>
                <TouchableOpacity
                    onPress={() => setIsCreating(true)}
                    style={{ marginLeft: 12, width: 32, height: 32, backgroundColor: '#fbbf24', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Plus size={20} color="black" strokeWidth={3} />
                </TouchableOpacity>
            </View>

            <Text style={{ color: '#71717a', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
                Tap a group to edit, or Select to play 🎯
            </Text>

            {/* Groups List */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {groups.length === 0 ? (
                    <Animated.View entering={FadeIn} style={{ alignItems: 'center', paddingVertical: 60 }}>
                        <Text style={{ fontSize: 48, marginBottom: 16 }}>👥</Text>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>No groups yet</Text>
                        <TouchableOpacity
                            onPress={() => setIsCreating(true)}
                            style={{ backgroundColor: '#22c55e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Create First Group</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    groups.map((group, index) => (
                        <Animated.View
                            key={group.id}
                            entering={FadeInDown.delay(index * 100)}
                            style={{ marginBottom: 16 }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleEditGroup(group)}
                                style={{ backgroundColor: '#1a1a1a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a2a' }}
                            >
                                {/* Header */}
                                <View style={{ backgroundColor: group.color || '#22c55e', paddingVertical: 14, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                            {group.name} {group.emoji}
                                        </Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                            {group.players.length} players
                                        </Text>
                                    </View>
                                    <Edit3 size={18} color="white" style={{ opacity: 0.8 }} />
                                </View>

                                {/* Preview */}
                                <View style={{ padding: 16 }}>
                                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                                        {group.players.slice(0, 5).map((player, i) => (
                                            <View key={i} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: group.color || '#22c55e', opacity: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{player[0]}</Text>
                                            </View>
                                        ))}
                                        {group.players.length > 5 && (
                                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: '#71717a', fontSize: 10 }}>+{group.players.length - 5}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleSelectGroup(group)}
                                        style={{ borderWidth: 2, borderColor: group.color || '#22c55e', paddingVertical: 10, borderRadius: 20, alignItems: 'center' }}
                                    >
                                        <Text style={{ color: group.color || '#22c55e', fontWeight: 'bold', fontSize: 14 }}>Play with this group ✨</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))
                )}
            </ScrollView>

            <View style={{ alignItems: 'center', paddingTop: 16 }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ width: 56, height: 56, backgroundColor: '#3b82f6', borderRadius: 28, justifyContent: 'center', alignItems: 'center' }}
                >
                    <X size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

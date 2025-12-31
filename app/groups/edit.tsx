import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trash2, Plus, Check, Edit2 } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { getGroupById, updateGroup, PlayerGroup, getRandomColor } from '../../services/groupsService';

const { width } = Dimensions.get('window');

export default function EditGroup() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const groupId = Array.isArray(id) ? id[0] : id;

    const [group, setGroup] = useState<PlayerGroup | null>(null);
    const [name, setName] = useState('');
    const [players, setPlayers] = useState<string[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [color, setColor] = useState('#22c55e');

    useEffect(() => {
        loadGroup();
    }, [groupId]);

    const loadGroup = async () => {
        if (!groupId) return;
        const data = await getGroupById(groupId);
        if (data) {
            setGroup(data);
            setName(data.name);
            setPlayers(data.players);
            setColor(data.color || getRandomColor());
        }
    };

    const handleSave = async () => {
        if (!groupId || !name.trim() || players.length < 3) {
            Alert.alert('Error', 'Please ensure group has a name and at least 3 players.');
            return;
        }

        await updateGroup(groupId, {
            name: name.trim(),
            players,
            color
        });

        router.back();
    };

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const formatted = newPlayerName.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        if (players.some(p => p.toLowerCase() === formatted.toLowerCase())) {
            Alert.alert('Duplicate', 'Player already exists!');
            return;
        }

        setPlayers([...players, formatted]);
        setNewPlayerName('');
    };

    const removePlayer = (index: number) => {
        const newList = [...players];
        newList.splice(index, 1);
        setPlayers(newList);
    };

    const changeColor = () => {
        setColor(getRandomColor());
    };

    if (!group) return <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} />;

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingTop: 56 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ width: 44, height: 44, backgroundColor: '#1a1a1a', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}
                >
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                {isEditingName ? (
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        onBlur={() => setIsEditingName(false)}
                        style={{ color: 'white', fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: color, minWidth: 150, textAlign: 'center' }}
                    />
                ) : (
                    <TouchableOpacity onPress={() => setIsEditingName(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{name} {group.emoji}</Text>
                        <Edit2 size={16} color="#71717a" />
                    </TouchableOpacity>
                )}

                <View style={{ width: 44 }} />
            </View>

            {/* Color Picker */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Text style={{ color: '#71717a', marginBottom: 8, fontSize: 12 }}>Color</Text>
                <TouchableOpacity onPress={changeColor}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: color, borderWidth: 4, borderColor: '#1a1a1a', shadowColor: color, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 }} />
                </TouchableOpacity>
            </View>

            {/* Players Section */}
            <View style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a2a' }}>
                <View style={{ backgroundColor: color, paddingVertical: 12, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Add, remove or reorder players</Text>
                </View>

                <ScrollView style={{ flex: 1, padding: 16 }}>
                    {players.map((player, index) => (
                        <Animated.View
                            key={`${player}-${index}`}
                            entering={FadeInDown.delay(index * 50)}
                            layout={Layout.springify()}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                        >
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color, justifyContent: 'center', alignItems: 'center', marginRight: 12, opacity: 0.8 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{player[0]}</Text>
                            </View>
                            <Text style={{ flex: 1, color: 'white', fontSize: 18, fontWeight: '500' }}>{player}</Text>
                            <TouchableOpacity onPress={() => removePlayer(index)} style={{ padding: 8 }}>
                                <Trash2 size={20} color="#71717a" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </ScrollView>

                {/* Add Player Input */}
                <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#2a2a2a', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={addPlayer}
                        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Add new player..."
                        placeholderTextColor="#52525b"
                        style={{ flex: 1, color: 'white', fontSize: 16 }}
                        value={newPlayerName}
                        onChangeText={setNewPlayerName}
                        onSubmitEditing={addPlayer}
                    />
                </View>
            </View>

            {/* Save Button */}
            <View style={{ paddingVertical: 24 }}>
                <TouchableOpacity
                    onPress={handleSave}
                    style={{ backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 999, alignItems: 'center', shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Save changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

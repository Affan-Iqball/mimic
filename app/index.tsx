import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, ShoppingCart, FileText, Trophy, Archive, Play } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function Home() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
            {/* Header Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56 }}>
                {/* Language Selector */}
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={{ width: 32, height: 20, backgroundColor: '#1e3a8a', borderRadius: 4, marginBottom: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                        <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>🇬🇧</Text>
                    </View>
                    <Text style={{ color: 'white', fontSize: 11 }}>English</Text>
                </TouchableOpacity>

                {/* Profile Button */}
                <TouchableOpacity style={{ width: 44, height: 44, backgroundColor: '#22d3ee', borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>M</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>

                {/* Title */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginBottom: 60 }}>
                    <Text style={{ color: 'white', fontSize: 64, fontWeight: '900', textAlign: 'center', lineHeight: 68 }}>MIMIC</Text>
                </Animated.View>

                {/* Play Button */}
                <Animated.View entering={FadeIn.delay(300)}>
                    <TouchableOpacity
                        onPress={() => router.push('/mode')}
                        activeOpacity={0.8}
                        style={{
                            width: 160,
                            height: 200,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderWidth: 3,
                            borderColor: 'white',
                            borderRadius: 16,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Play size={56} color="white" fill="white" />
                    </TouchableOpacity>
                </Animated.View>

            </View>

            {/* Bottom Navigation */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16, paddingBottom: 36 }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                    <Settings size={28} color="#4ade80" />
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                    <ShoppingCart size={28} color="#60a5fa" />
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                    <FileText size={28} color="#fbbf24" />
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
                    <Trophy size={28} color="#fbbf24" />
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, position: 'relative' }}>
                    <Archive size={28} color="#f472b6" />
                    {/* Notification Badge */}
                    <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#ef4444', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0a0a0a' }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>1</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

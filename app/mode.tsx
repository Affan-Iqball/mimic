import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, Smartphone, X } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function ModeSelect() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>

            <Animated.View entering={SlideInDown.springify()} style={{ width: '100%', maxWidth: 340 }}>

                {/* Online Mode - Disabled/Coming Soon */}
                <TouchableOpacity
                    disabled={true}
                    style={{
                        backgroundColor: '#1a1a1a',
                        padding: 24,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: '#2a2a2a',
                        opacity: 0.5
                    }}
                >
                    <View style={{ width: 48, height: 48, backgroundColor: '#2a2a2a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                        <Globe size={24} color="#71717a" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ color: '#71717a', fontSize: 18, fontWeight: 'bold' }}>Online mode</Text>
                            <View style={{ backgroundColor: '#2a2a2a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                                <Text style={{ color: '#52525b', fontSize: 10, fontWeight: 'bold' }}>SOON</Text>
                            </View>
                        </View>
                        <Text style={{ color: '#52525b', fontSize: 13, marginTop: 4 }}>Play with friends remotely</Text>
                    </View>
                </TouchableOpacity>

                {/* Offline Mode - Active */}
                <TouchableOpacity
                    onPress={() => router.push('/setup')}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: '#22c55e',
                        padding: 24,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#22c55e',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 8
                    }}
                >
                    <View style={{ width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                        <Smartphone size={24} color="white" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Offline mode</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>Everyone plays on the same phone</Text>
                    </View>
                </TouchableOpacity>

            </Animated.View>

            {/* Close Button */}
            <Animated.View entering={FadeIn.delay(200)}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginTop: 32, width: 56, height: 56, backgroundColor: '#1a1a1a', borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}
                >
                    <X size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>

        </View>
    );
}

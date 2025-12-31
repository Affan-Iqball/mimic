import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Coffee, Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HelpScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ width: 40, height: 40, backgroundColor: '#1a1a1a', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' }}
                >
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>About Mimic</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <Text style={{ color: '#a1a1aa', fontSize: 16, lineHeight: 26, marginBottom: 24 }}>
                        I built this game for one simple reason: <Text style={{ color: 'white', fontWeight: 'bold' }}>Family Game Night.</Text>
                    </Text>

                    <Text style={{ color: '#a1a1aa', fontSize: 16, lineHeight: 26, marginBottom: 24 }}>
                        I play typical undercover games with my siblings all the time, but we were endlessly frustrated. The existing apps were either locked behind expensive paywalls or just plain boring with repetitive words.
                    </Text>

                    <Text style={{ color: '#a1a1aa', fontSize: 16, lineHeight: 26, marginBottom: 24 }}>
                        So I decided to build my own.
                    </Text>

                    <Text style={{ color: '#a1a1aa', fontSize: 16, lineHeight: 26, marginBottom: 24 }}>
                        <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>Mimic</Text> is my personal take on the genre—completely free, ad-free, and injected with a <Text style={{ color: '#ec4899', fontWeight: 'bold' }}>"Modern Desi Twist"</Text>.
                    </Text>

                    <Text style={{ color: '#a1a1aa', fontSize: 16, lineHeight: 26, marginBottom: 32 }}>
                        It combines global pop culture with the things we actually talk about—from Biryani vs Pulao to Arranged Marriages. It's built to be the most fun way to determine who among us is the imposter.
                    </Text>
                </Animated.View>

                {/* Developer Card */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={{ backgroundColor: '#171717', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#262626' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#22d3ee', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ fontSize: 20 }}>👨‍💻</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Built by Affan</Text>
                            <Text style={{ color: '#52525b', fontSize: 13 }}>Solo Developer</Text>
                        </View>
                    </View>
                    <Text style={{ color: '#71717a', fontSize: 14, lineHeight: 20 }}>
                        If you enjoyed this, check out my other projects on GitHub or buy me a coffee!
                    </Text>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://github.com/affan')}
                        style={{ marginTop: 16, backgroundColor: '#262626', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                    >
                        <Text style={{ color: 'white', fontWeight: '600' }}>View on GitHub</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 40 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'center', opacity: 0.5 }}>
                    <Text style={{ color: '#52525b', fontSize: 12 }}>Version 1.0.0 • Mimic</Text>
                </View>

            </ScrollView>
        </View>
    );
}

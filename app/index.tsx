import { View, Text, TouchableOpacity, ScrollView, StatusBar, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, BookOpen, Clock, ShoppingBag, UserRoundSearch } from 'lucide-react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    // Bouncy Button Logic
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.95);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePlayLocal = () => {
        router.push('/setup');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Subtle Glow Behind Logo (Only Exception) */}
            <View style={styles.logoGlow} />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* 1. HEADER */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>MIMIC</Text>
                    </View>

                    <TouchableOpacity style={styles.profileButton}>
                        <Text style={{ fontSize: 24 }}>😎</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. HERO SECTION - "LOCAL PARTY" */}
                <Animated.View style={[styles.heroContainer, animatedStyle]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        onPress={handlePlayLocal}
                        style={styles.heroCard}
                    >
                        <LinearGradient
                            colors={['#FF0080', '#7928CA']} // Hot Pink to Violet
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroGradient}
                        >
                            {/* Watermark Icon - Clipped by overflow:hidden */}
                            <View style={styles.watermarkContainer}>
                                <UserRoundSearch size={120} color="white" style={{ opacity: 0.15 }} />
                            </View>

                            {/* Content */}
                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle}>LOCAL PARTY</Text>
                                <View style={styles.heroSubtextBadge}>
                                    <Text style={styles.heroSubtext}>Pass the Phone • 3+ Players</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Secondary Button - Online Lobby */}
                    <TouchableOpacity style={styles.onlineLobbyButton}>
                        <Text style={styles.onlineLobbyText}>Online Lobby (Coming Soon)</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* 3. BENTO GRID - Utility Cards */}
                <View style={styles.bentoGrid}>
                    {/* Item 1: Rules */}
                    <TouchableOpacity style={styles.bentoCard}>
                        <View style={[styles.bentoIcon, { backgroundColor: '#3b82f6' }]}>
                            <BookOpen size={24} color="white" />
                        </View>
                        <Text style={styles.bentoCardTitle}>How to Play</Text>
                    </TouchableOpacity>

                    {/* Item 2: History */}
                    <TouchableOpacity style={styles.bentoCard}>
                        <View style={[styles.bentoIcon, { backgroundColor: '#f97316' }]}>
                            <Clock size={24} color="white" />
                        </View>
                        <View>
                            <Text style={styles.bentoCardTitle}>Last Winner</Text>
                            <Text style={styles.bentoCardSubtitle}>None yet</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Item 3: Shop */}
                    <TouchableOpacity onPress={() => router.push('/packs')} style={styles.bentoCard}>
                        <View style={[styles.bentoIcon, { backgroundColor: '#22c55e' }]}>
                            <ShoppingBag size={24} color="white" />
                        </View>
                        <View>
                            <Text style={styles.bentoCardTitle}>Shop</Text>
                            <Text style={styles.bentoCardBadge}>NEW PACKS</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Item 4: Settings */}
                    <TouchableOpacity style={styles.bentoCard}>
                        <View style={[styles.bentoIcon, { backgroundColor: '#71717a' }]}>
                            <Settings size={24} color="white" />
                        </View>
                        <Text style={styles.bentoCardTitle}>Settings</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // =====================
    // 1. BACKGROUND & GLOW
    // =====================
    container: {
        flex: 1,
        backgroundColor: '#121212', // Solid Deep Charcoal - NO SHAPES
    },
    logoGlow: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#7928CA', // Purple
        opacity: 0.2, // Strictly 0.2
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
    },

    // =====================
    // 2. HEADER
    // =====================
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        transform: [{ rotate: '-3deg' }],
    },
    logoText: {
        fontSize: 42,
        fontWeight: '900',
        color: 'white',
        textShadowColor: '#db2777', // Pink shadow
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 0,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#252525',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },

    // =====================
    // 3. HERO CARD
    // =====================
    heroContainer: {
        marginBottom: 40,
    },
    heroCard: {
        height: 220,
        borderRadius: 40, // Squircle
        overflow: 'hidden', // CRITICAL: Clips the watermark icon
        elevation: 10,
        shadowColor: '#FF0080',
        shadowOpacity: 0.4,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
    },
    heroGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    watermarkContainer: {
        position: 'absolute',
        right: -20,
        bottom: -10,
    },
    heroContent: {
        alignItems: 'center',
        zIndex: 1, // Ensures text is above watermark
    },
    heroTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: 1,
        textAlign: 'center',
    },
    heroSubtextBadge: {
        marginTop: 12,
        backgroundColor: 'rgba(0,0,0,0.25)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    heroSubtext: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // =====================
    // 4. ONLINE LOBBY BUTTON
    // =====================
    onlineLobbyButton: {
        marginTop: 16,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderWidth: 2,
        borderColor: 'white', // White border, not grey
        borderRadius: 24,
    },
    onlineLobbyText: {
        color: '#FFFFFF', // Pure White - must look clickable
        fontWeight: 'bold',
        opacity: 1.0, // Fully opaque
    },

    // =====================
    // 5. BENTO GRID
    // =====================
    bentoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    bentoCard: {
        width: (width - 48 - 16) / 2,
        backgroundColor: '#252525', // Card Background
        borderRadius: 24, // Super rounded
        padding: 20,
        height: 140,
        justifyContent: 'space-between',
        // CRITICAL: Border for separation
        borderWidth: 1,
        borderColor: '#333333', // Exactly this color
    },
    bentoIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bentoCardTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bentoCardSubtitle: {
        color: '#71717a',
        fontSize: 12,
        marginTop: 2,
    },
    bentoCardBadge: {
        color: '#22c55e',
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 2,
    },
});

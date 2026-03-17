import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';
import { VibeCard } from '../../domain/types/vibe-card.types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DiscoveryCardProps {
    card: VibeCard;
    showFooter?: boolean; // deprecated/no longer used, footer is absolute outside
}

export const DiscoveryCard = React.memo<DiscoveryCardProps>(({ card }) => {
    return (
        <ScrollView style={styles.card} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.photoContainer}>
                {card.avatar ? (
                    <Image source={{ uri: card.avatar }} style={styles.mainPhoto} />
                ) : (
                    <View style={[styles.mainPhoto, { backgroundColor: card.backgroundColor || colors.secondary }]}>
                        <Text style={styles.subtitle}>{card.subtitle}</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{card.title}, 25</Text>
                <Text style={styles.subtitleText}>{card.subtitle}</Text>

                {/* Mock Sub Photos list like screenshot */}
                <View style={styles.subPhotosList}>
                    <View style={[styles.subPhotoPlaceholder, { backgroundColor: colors.overlayLight, height: 280 }]} />
                    <View style={[styles.subPhotoPlaceholder, { backgroundColor: colors.overlayLight, height: 220 }]} />
                </View>
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    card: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.bgDark,
    },
    scrollContent: {
        paddingBottom: 120, // space for fixed footer overlay
    },
    photoContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.65, // stretched photo looking
    },
    mainPhoto: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
    },
    subtitle: {
        fontSize: 30,
        fontWeight: '900',
        color: colors.white,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    infoContainer: {
        padding: spacing.lg,
    },
    nameText: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.white,
        marginBottom: spacing.lg,
    },
    promptCard: {
        backgroundColor: colors.overlayLight,
        borderRadius: 16,
        padding: spacing.md,
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    promptIcon: {
        marginTop: 2,
    },
    promptTextContainer: {
        flex: 1,
    },
    promptTitle: {
        fontSize: 13,
        color: colors.textOpacity60,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    promptAnswer: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        lineHeight: 24,
    },
    subtitleText: {
        fontSize: 16,
        color: colors.white,
        opacity: 0.85,
        lineHeight: 24,
        marginBottom: spacing.lg,
    },
    subPhotosList: {
        gap: spacing.lg,
        marginTop: spacing.md,
    },
    subPhotoPlaceholder: {
        width: '100%',
        borderRadius: 20,
    },
});

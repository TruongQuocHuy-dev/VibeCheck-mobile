import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { useDiscoveryDetail } from '../../application/hooks/useDiscoveryDetail';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import type { Candidate } from '../../domain/types/vibe-card.types';

export const DiscoveryDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const candidates: Candidate[] = route.params?.candidates || [];
  const initialIndex: number = route.params?.initialIndex || 0;

  const {
    currentCandidate,
    nextCandidate,
    swipe,
    panHandlers,
    animatedStyle,
    backgroundCardStyle,
    tintStyle,
    skipStyle,
    likeStyle,
    matchResult,
    isSwiping,
  } = useDiscoveryDetail(candidates, initialIndex, () => navigation.goBack());

  // Navigate to MatchReveal when a match happens
  useEffect(() => {
    if (matchResult?.isMatch && matchResult.match) {
      const { conversationId, matchedUser } = matchResult.match;
      navigation.navigate('MatchReveal', {
        matchedUserName: matchedUser.displayName,
        matchedUserAvatar: matchedUser.avatar,
        conversationId,
      });
    }
  }, [matchResult, navigation]);

  const insets = useSafeAreaInsets();

  if (!currentCandidate) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Icon name="checkmark-circle-outline" size={64} color={colors.neonCyan} />
        <Text style={styles.emptyText}>Đã xem hết rồi! 🎉</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} translucent />

      <View style={styles.content}>
        {/* Back */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + spacing.sm }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-down" size={28} color={colors.white} />
        </TouchableOpacity>

        {/* Header Right */}
        <View style={[styles.headerRight, { top: insets.top + spacing.sm }]}>
          {isSwiping && (
            <ActivityIndicator size="small" color={colors.neonCyan} style={{ marginRight: 8 }} />
          )}
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="ellipsis-vertical" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Deck */}
        <View style={styles.deckContainer}>
          {nextCandidate && (
            <Animated.View style={[styles.cardAbsolute, backgroundCardStyle]}>
              <DiscoveryCard candidate={nextCandidate} />
            </Animated.View>
          )}

          <Animated.View
            style={[styles.cardAbsolute, animatedStyle]}
            {...panHandlers}
          >
            <DiscoveryCard candidate={currentCandidate} />
            <Animated.View style={[styles.tintOverlay, tintStyle]} pointerEvents="none" />
          </Animated.View>

          {/* Fixed action footer */}
          <View style={[styles.fixedFooter, { bottom: insets.bottom + spacing.md }]}>
            <Animated.View style={skipStyle}>
              <TouchableOpacity
                style={[styles.bigButton, styles.skipBtn]}
                onPress={() => swipe('skip')}
                disabled={isSwiping}
              >
                <Icon name="close" size={36} color={colors.neonCyan} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={likeStyle}>
              <TouchableOpacity
                style={[styles.bigButton, styles.likeBtn]}
                onPress={() => swipe('like')}
                disabled={isSwiping}
              >
                <Icon name="heart" size={36} color={colors.white} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  backBtn: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.neonCyan,
  },
  backBtnText: {
    color: colors.bgDark,
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    elevation: 10,
  },
  headerRight: {
    position: 'absolute',
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 20,
    elevation: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  deckContainer: {
    flex: 1,
    position: 'relative',
  },
  cardAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  bigButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  likeBtn: {
    backgroundColor: colors.neonPink,
  },
  skipBtn: {
    backgroundColor: colors.white,
  },
});
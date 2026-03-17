import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { useDiscoveryDetail } from '../../application/hooks/useDiscoveryDetail';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';

export const DiscoveryDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const cards = route.params?.cards || [];
  const initialIndex = route.params?.initialIndex || 0;

  const {
    currentCard,
    nextCard,
    swipe,
    panHandlers,
    animatedStyle,
    backgroundCardStyle,
    tintStyle,
    skipStyle,
    likeStyle,
  } = useDiscoveryDetail(cards, initialIndex, () => navigation.goBack());

  const insets = useSafeAreaInsets();

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Hết thẻ rồi 🎉</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} translucent />

      <View style={styles.content}>
        {/* Back */}
        <TouchableOpacity style={[styles.backButton, { top: insets.top + spacing.sm }]} onPress={() => navigation.goBack()}>
          <Icon name="chevron-down" size={28} color={colors.white} />
        </TouchableOpacity>

        {/* Header Right Actions */}
        <View style={[styles.headerRight, { top: insets.top + spacing.sm }]}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="options-outline" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="ellipsis-vertical" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.deckContainer}>
          {nextCard && (
            <Animated.View style={[styles.cardAbsolute, backgroundCardStyle]}>
              <DiscoveryCard card={nextCard} />
            </Animated.View>
          )}

          <Animated.View
            style={[styles.cardAbsolute, animatedStyle]}
            {...panHandlers}
          >
            <DiscoveryCard card={currentCard} />
            <Animated.View style={[styles.tintOverlay, tintStyle]} pointerEvents="none" />
          </Animated.View>

          <View style={[styles.fixedFooter, { bottom: insets.bottom + spacing.md }]}>
            <Animated.View style={skipStyle}>
              <TouchableOpacity
                style={[styles.bigButton, styles.skip]}
                onPress={() => swipe('skip')}
              >
                <Icon name="close" size={36} color={colors.neonCyan} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={likeStyle}>
              <TouchableOpacity
                style={[styles.bigButton, styles.like]}
                onPress={() => {
                  swipe('like');
                  navigation.navigate('MatchReveal');
                }}
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
    padding: 0, // Fill screen edges
  },

  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // highest zIndex
    elevation: 10, // Ensure elevated on Android
  },

  headerRight: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 20, // highest zIndex
    elevation: 10, // Ensure elevated on Android
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
    marginTop: 0,
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
    bottom: spacing.lg,
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

  like: {
    backgroundColor: colors.neonPink,
  },

  skip: {
    backgroundColor: colors.white,
  },

  emptyText: {
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
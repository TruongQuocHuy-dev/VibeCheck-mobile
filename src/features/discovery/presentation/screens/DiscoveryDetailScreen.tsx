import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useDiscoveryDetail } from '../../application/hooks/useDiscoveryDetail';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';

export const DiscoveryDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const cards = route.params?.cards || [];
  const initialIndex = route.params?.initialIndex || 0;

  const {
    currentCard,
    translateX,
    translateY,
    rotate,
    opacity,
    swipe,
    setTranslateX,
    setRotate,
  } = useDiscoveryDetail(cards, initialIndex, () => navigation.goBack());

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,

      onPanResponderMove: (_, g) => {
        setTranslateX(g.dx);
        setRotate(g.dx / 15);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dx > 100) swipe('like');
        else if (g.dx < -100) swipe('skip');
        else {
          setTranslateX(0);
          setRotate(0);
        }
      },
    })
  ).current;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Hết thẻ rồi 🎉</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <LinearGradient
        colors={[colors.bgDark, currentCard.backgroundColor || colors.secondary]}
        style={styles.content}
      >
        {/* Back */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-down" size={28} color={colors.white} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.cardWrapper, animatedStyle]}
          {...panResponder.panHandlers}
        >
          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.tag}>{currentCard.title.toUpperCase()}</Text>

            <Text style={styles.subtitle}>
              {currentCard.subtitle}
            </Text>

            <View style={styles.locationContainer}>
              <Icon name="location" size={20} color={colors.neonCyan} />
              <Text style={styles.locationText}>
                {currentCard.distance} - {currentCard.location}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.bigButton, styles.skip]}
              onPress={() => swipe('skip')}
            >
              <Icon name="close" size={36} color={colors.neonCyan} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bigButton, styles.like]}
              onPress={() => swipe('like')}
            >
              <Icon name="heart" size={36} color={colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },

  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  cardWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },

  tag: {
    fontSize: 14,
    color: colors.textOpacity60,
    letterSpacing: 2,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 44,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  locationText: {
    fontSize: 16,
    color: colors.neonCyan,
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },

  bigButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  like: {
    backgroundColor: colors.neonPink,
  },

  skip: {
    borderWidth: 2,
    borderColor: colors.neonCyan,
  },

  emptyText: {
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
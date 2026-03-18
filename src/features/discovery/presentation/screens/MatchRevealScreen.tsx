import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { useMatchReveal } from '../../application/hooks/useMatchReveal';
import { MatchActions } from '../components/MatchActions';
import { mockMatchInfo } from '../../data/match.data';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';

const { width, height } = Dimensions.get('window');

export const MatchRevealScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const { leftAnimatedStyle, rightAnimatedStyle, pulseTextStyle } = useMatchReveal();

  const myAvatar = mockMatchInfo.userAvatar;
  const matchAvatar = mockMatchInfo.matchAvatar;
  const matchName = mockMatchInfo.matchName;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Glowing Orbs Background */}
      <View style={styles.absoluteBackground}>
        <View style={styles.topOrb} />
        <View style={styles.bottomOrb} />
      </View>

      {/* Content Container */}
      <View style={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.md }]}>

        {/* Header Title Information */}
        <Animated.View style={[styles.header, pulseTextStyle]}>
          <Text style={styles.titleText}>IT'S A</Text>
          <Text style={styles.titleTextPink}>VIBE!</Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{`YOU MATCHED WITH ${matchName.toUpperCase()}`}</Text>
          </View>
        </Animated.View>

        {/* Overlapping CIRCULAR Avatars */}
        <View style={styles.avatarsWrapper}>
          <LinearGradient
            colors={[colors.neonPink, 'rgba(255,0,153,0)']}
            style={[styles.avatarGlow, styles.leftGlow]}
          />
          <LinearGradient
            colors={[colors.neonCyan, 'rgba(0,255,238,0)']}
            style={[styles.avatarGlow, styles.rightGlow]}
          />

          <Animated.View style={[styles.avatarCircle, styles.leftAvatar, leftAnimatedStyle]}>
            <Image source={{ uri: myAvatar }} style={styles.avatarImage} />
          </Animated.View>
          <Animated.View style={[styles.avatarCircle, styles.rightAvatar, rightAnimatedStyle]}>
            <Image source={{ uri: matchAvatar }} style={styles.avatarImage} />
          </Animated.View>

          {/* Floating Action Icons overlays */}
          <View style={styles.iconHeart}>
            <Icon name="heart" size={28} color={colors.neonPink} />
          </View>
          <View style={styles.iconBolt}>
            <Icon name="flash" size={28} color={colors.neonCyan} />
          </View>
        </View>

        {/* Action Buttons Footer section */}
        <MatchActions 
          onChatPress={() => navigation.goBack()}
          onBrowsePress={() => navigation.goBack()}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Charcoal dark back layer overlay
  },
  absoluteBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  topOrb: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 0, 153, 0.15)', // transparent neon Pink
  },
  bottomOrb: {
    position: 'absolute',
    bottom: '25%',
    right: '5%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 255, 238, 0.15)', // transparent neon Cyan
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  titleText: {
    fontSize: 52,
    fontWeight: '900',
    fontStyle: 'italic',
    color: colors.white,
    letterSpacing: -1,
    lineHeight: 56,
  },
  titleTextPink: {
    fontSize: 54,
    fontWeight: '900',
    fontStyle: 'italic',
    color: colors.neonPink,
    letterSpacing: -1,
    lineHeight: 56,
    shadowColor: colors.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  matchBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  matchBadgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  avatarsWrapper: {
    position: 'relative',
    height: 200,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: colors.overlayLight,
  },
  leftAvatar: {
    borderColor: colors.neonPink,
    marginRight: -40, // overlap
    transform: [{ rotate: '-6deg' }],
    zIndex: 10,
  },
  rightAvatar: {
    borderColor: colors.neonCyan,
    transform: [{ rotate: '12deg' }],
    zIndex: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.4,
  },
  leftGlow: {
    left: '20%',
  },
  rightGlow: {
    right: '25%',
  },
  iconHeart: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    zIndex: 20,
  },
  iconBolt: {
    position: 'absolute',
    top: 0,
    right: '25%',
    zIndex: 20,
  },
});

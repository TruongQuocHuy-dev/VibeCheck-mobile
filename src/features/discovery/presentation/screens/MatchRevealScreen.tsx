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
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { useMatchReveal } from '../../application/hooks/useMatchReveal';
import { MatchActions } from '../components/MatchActions';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';

const { width } = Dimensions.get('window');

export const MatchRevealScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { leftAnimatedStyle, rightAnimatedStyle, pulseTextStyle } = useMatchReveal();

  // Real data from navigation params (passed by DiscoveryDetailScreen after API match)
  const matchedUserName: string = route.params?.matchedUserName ?? 'Someone';
  const matchedUserAvatar: string | null = route.params?.matchedUserAvatar ?? null;
  const conversationId: string | null = route.params?.conversationId ?? null;

  // For myAvatar we would need the auth store — using a placeholder style for now
  const myAvatarUri: string | null = route.params?.myAvatar ?? null;

  const handleChatPress = () => {
    navigation.navigate('ChatDetail', {
      conversationId,
      name: matchedUserName,
      avatar: matchedUserAvatar,
      isOnline: false,
    });
  };

  const handleBrowsePress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Glowing Orbs Background */}
      <View style={styles.absoluteBackground}>
        <View style={styles.topOrb} />
        <View style={styles.bottomOrb} />
      </View>

      <View style={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.md }]}>

        {/* Header */}
        <Animated.View style={[styles.header, pulseTextStyle]}>
          <Text style={styles.titleText}>IT'S A</Text>
          <Text style={styles.titleTextPink}>VIBE!</Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>{`BẠN ĐÃ MATCH VỚI ${matchedUserName.toUpperCase()}`}</Text>
          </View>
        </Animated.View>

        {/* Avatars */}
        <View style={styles.avatarsWrapper}>
          <LinearGradient
            colors={[colors.neonPink, 'rgba(255,0,153,0)']}
            style={[styles.avatarGlow, styles.leftGlow]}
          />
          <LinearGradient
            colors={[colors.neonCyan, 'rgba(0,255,238,0)']}
            style={[styles.avatarGlow, styles.rightGlow]}
          />

          {/* My avatar */}
          <Animated.View style={[styles.avatarCircle, styles.leftAvatar, leftAnimatedStyle]}>
            {myAvatarUri ? (
              <Image source={{ uri: myAvatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarImage, styles.avatarFallback]}>
                <Icon name="person" size={40} color={colors.textOpacity60} />
              </View>
            )}
          </Animated.View>

          {/* Matched user avatar */}
          <Animated.View style={[styles.avatarCircle, styles.rightAvatar, rightAnimatedStyle]}>
            {matchedUserAvatar ? (
              <Image source={{ uri: matchedUserAvatar }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarImage, styles.avatarFallback]}>
                <Icon name="person" size={40} color={colors.textOpacity60} />
              </View>
            )}
          </Animated.View>

          <View style={styles.iconHeart}>
            <Icon name="heart" size={28} color={colors.neonPink} />
          </View>
          <View style={styles.iconBolt}>
            <Icon name="flash" size={28} color={colors.neonCyan} />
          </View>
        </View>

        <MatchActions
          onChatPress={handleChatPress}
          onBrowsePress={handleBrowsePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  absoluteBackground: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  topOrb: {
    position: 'absolute',
    top: '15%', left: '10%',
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(255,0,153,0.15)',
  },
  bottomOrb: {
    position: 'absolute',
    bottom: '25%', right: '5%',
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(0,255,238,0.15)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  header: { alignItems: 'center', marginTop: spacing.xl },
  titleText: {
    fontSize: 52, fontWeight: '900', fontStyle: 'italic',
    color: colors.white, letterSpacing: -1, lineHeight: 56,
  },
  titleTextPink: {
    fontSize: 54, fontWeight: '900', fontStyle: 'italic',
    color: colors.neonPink, letterSpacing: -1, lineHeight: 56,
    shadowColor: colors.neonPink,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 8,
  },
  matchBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  matchBadgeText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  avatarsWrapper: {
    position: 'relative', height: 200, width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  avatarCircle: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 4, overflow: 'hidden',
    backgroundColor: colors.overlayLight,
  },
  leftAvatar: { borderColor: colors.neonPink, marginRight: -40, transform: [{ rotate: '-6deg' }], zIndex: 10 },
  rightAvatar: { borderColor: colors.neonCyan, transform: [{ rotate: '12deg' }], zIndex: 5 },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarFallback: { backgroundColor: colors.cardDark, justifyContent: 'center', alignItems: 'center' },
  avatarGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 80, opacity: 0.4 },
  leftGlow: { left: '20%' },
  rightGlow: { right: '25%' },
  iconHeart: { position: 'absolute', bottom: 0, left: '25%', zIndex: 20 },
  iconBolt: { position: 'absolute', top: 0, right: '25%', zIndex: 20 },
});

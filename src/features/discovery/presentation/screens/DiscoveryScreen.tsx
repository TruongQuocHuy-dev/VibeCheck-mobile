import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useDiscovery } from '../../application/hooks/useDiscovery';
import { VibeCard } from '../../domain/types/vibe-card.types';
import { spacing } from '../../../../core/theme/spacing';
import { colors } from '../../../../core/theme/colors';
import { typography } from '../../../../core/theme';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export const DiscoveryScreen: React.FC = () => {
  const { cards } = useDiscovery();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const handleCardPress = (item: VibeCard) => {
    navigation.navigate('DiscoveryDetail', { cards, initialIndex: 0 });
  };

  const renderCardItem = ({ item }: { item: VibeCard }) => {
    return (
      <TouchableOpacity
        style={[styles.cardContainer, { width: CARD_WIDTH }]}
        activeOpacity={0.9}
        onPress={() => handleCardPress(item)}
      >
        <ImageBackground
          source={item.avatar ? { uri: item.avatar } : undefined}
          style={styles.cardGradient}
          imageStyle={{ borderRadius: 24 }}
        >
          {/* Bottom Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.bottomOverlay}
          >
            <View style={styles.infoRow}>
              <Text style={styles.nameText}>{item.title}</Text>
              <Text style={styles.ageText}>, 24</Text>
            </View>
            <Text style={styles.bioText} numberOfLines={2}>{item.subtitle}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.locationContainerCard}>
                <Icon name="location" size={14} color={colors.neonCyan} />
                <Text style={styles.locationTextCard} numberOfLines={1}>
                  {item.distance} - {item.location}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.skipButtonSmall]}>
                  <Icon name="close" size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.likeButtonSmall]}
                  onPress={() => navigation.navigate('MatchReveal')}
                >
                  <Icon name="heart" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>VIBECHECK<Text style={styles.headerSubtitle}></Text></Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications-outline" size={20} color={colors.white} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="options-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Single Card View */}
      <View
        style={[
          styles.singleCardWrapper,
          { paddingBottom: spacing.xl + insets.bottom },
        ]}
      >
        {cards.length > 0 && renderCardItem({ item: cards[0] })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.overlayLight,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: 'bold',
    color: colors.neonCyan,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  singleCardWrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  cardContainer: {
    height: height * 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end', // overlay content aligns to bottom
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  ageText: {
    fontSize: 20,
    color: colors.white,
    opacity: 0.9,
  },
  bioText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  locationContainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationTextCard: {
    fontSize: 12,
    color: colors.neonCyan,
  },
  cardHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  cardTag: {
    fontSize: 12,
    color: colors.textOpacity60,
    letterSpacing: 1,
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 34,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 12,
    color: colors.textOpacity80,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButtonSmall: {
    backgroundColor: colors.neonPink,
  },
  skipButtonSmall: {
    backgroundColor: colors.neonCyan,
  },
});

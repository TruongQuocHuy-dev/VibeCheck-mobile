import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { useDiscoveryDetail } from '../../application/hooks/useDiscoveryDetail';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import type { Candidate, DiscoveryFilters } from '../../domain/types/vibe-card.types';
import { blockCandidate, fetchCandidates, reportCandidate } from '../../data/discovery.service';
import { DiscoveryFilterSheet } from '../components/DiscoveryFilterSheet';
import { UserSafetyActionSheet } from '../../../../shared/components/actions/index';
import { useToast } from '../../../../shared/hooks/useToast';
import { useLoading } from '../../../../shared/hooks/useLoading';
import { EmptyState } from '../../../../shared/components/feedback/Empty';

export const DiscoveryDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const initialCandidates: Candidate[] = route.params?.candidates || [];
  const routeFilters = route.params?.filters;
  const initialFilters: DiscoveryFilters = {
    minAge: routeFilters?.minAge ?? 18,
    maxAge: routeFilters?.maxAge ?? 40,
    gender: routeFilters?.gender ?? 'all',
  };
  const [candidates, setCandidates] = React.useState<Candidate[]>(initialCandidates);
  const [filters, setFilters] = React.useState<DiscoveryFilters>(initialFilters);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = React.useState(false);
  const [isSafetyMenuVisible, setIsSafetyMenuVisible] = React.useState(false);
  const isRefreshingRef = React.useRef(false);
  const initialIndex: number = route.params?.initialIndex || 0;

  useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);

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
    canUndoDislike,
    undoLastDislike,
    dismissMatch,
  } = useDiscoveryDetail(candidates, initialIndex, () => navigation.goBack());

  const mergeLatestCandidates = React.useCallback((latest: Candidate[]) => {
    setCandidates((prev) => {
      const seen = new Set<string>();
      const merged = [...prev, ...latest].filter((item) => {
        if (seen.has(item._id)) {
          return false;
        }
        seen.add(item._id);
        return true;
      });

      return merged;
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      const ric = (globalThis as any).requestIdleCallback;
      const cancelRic = (globalThis as any).cancelIdleCallback;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      let idleId: number | null = null;

      const refresh = () => {
        if (!active || isRefreshingRef.current) {
          return;
        }

        isRefreshingRef.current = true;

        const doRefresh = async () => {
          try {
            const latestWithFilter = await fetchCandidates(filters);
            if (!active) return;
            mergeLatestCandidates(latestWithFilter);
          } catch (error) {
            // Keep current deck if refresh fails.
          } finally {
            isRefreshingRef.current = false;
          }
        };

        if (typeof ric === 'function') {
          idleId = ric(doRefresh);
        } else {
          timeoutId = setTimeout(doRefresh, 0);
        }
      };

      refresh();

      return () => {
        active = false;
        if (idleId !== null && typeof cancelRic === 'function') {
          cancelRic(idleId);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [mergeLatestCandidates, filters])
  );

  const handleApplyFilters = React.useCallback((nextFilters: DiscoveryFilters) => {
    setFilters(nextFilters);
    DeviceEventEmitter.emit('discovery_filters_changed', nextFilters);
  }, []);

  const handleBlockCurrentUser = React.useCallback(() => {
    const userId = currentCandidate?._id;
    if (!userId) return;

    showLoading('Dang chan...');
    blockCandidate(userId)
      .then(() => {
        swipe('dislike');
        showToast('Da chan nguoi dung.', 'success');
      })
      .catch((error: any) => {
        showToast(error?.message || 'Khong the chan. Vui long thu lai.', 'error');
      })
      .finally(() => {
        hideLoading();
      });
  }, [currentCandidate?._id, swipe, showLoading, hideLoading, showToast]);

  const handleReportCurrentUser = React.useCallback(() => {
    const userId = currentCandidate?._id;
    if (!userId) return;

    showLoading('Dang gui bao cao...');
    reportCandidate(userId, 'unsafe_behavior')
      .then(() => {
        swipe('dislike');
        showToast('Da tiep nhan bao cao. Cam on ban.', 'success');
      })
      .catch((error: any) => {
        showToast(error?.message || 'Khong the bao cao. Vui long thu lai.', 'error');
      });
  }, [currentCandidate?._id, swipe, showLoading, showToast]);

  const handleUndoDislike = React.useCallback(() => {
    showLoading('Dang hoan tac...');
    undoLastDislike()
      .then((ok) => {
        if (ok) {
          showToast('Da tra lai the vua bo qua.', 'success');
        }
      })
      .catch((error: any) => {
        showToast(error?.message || 'Khong the hoan tac. Vui long thu lai.', 'error');
      })
      .finally(() => {
        hideLoading();
      });
  }, [undoLastDislike, showLoading, hideLoading, showToast]);

  // Navigate to MatchReveal when a match happens
  useEffect(() => {
    if (!isFocused) return;

    if (matchResult?.isMatch && matchResult.match) {
      console.log('DiscoveryDetail: Navigating to MatchReveal', matchResult.match);
      const { conversationId, matchedUser } = matchResult.match as any;
      navigation.navigate('MatchReveal', {
        matchedUserName: matchedUser.fullName || matchedUser.displayName,
        matchedUserAvatar: matchedUser.avatar,
        conversationId,
        otherUserId: matchedUser._id || matchedUser.id,
        isOnline: matchedUser.isOnline ?? false,
      });
    }
  }, [matchResult, navigation, isFocused]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('match_reveal_consumed', () => {
      dismissMatch();
    });

    return () => {
      sub.remove();
    };
  }, [dismissMatch]);

  const insets = useSafeAreaInsets();

  if (!currentCandidate) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          emoji="🎉"
          title="Đã xem hết rồi!"
          actionLabel="Quay lại"
          onActionPress={() => navigation.goBack()}
        />
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
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsFilterSheetVisible(true)}>
            <Icon name="options-outline" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, !canUndoDislike && styles.headerButtonDisabled]}
            onPress={handleUndoDislike}
            disabled={!canUndoDislike || isSwiping}
          >
            <Icon
              name="arrow-undo"
              size={20}
              color={canUndoDislike ? colors.neonCyan : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsSafetyMenuVisible(true)}>
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
                onPress={() => swipe('dislike')}
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

      <DiscoveryFilterSheet
        visible={isFilterSheetVisible}
        filters={filters}
        onClose={() => setIsFilterSheetVisible(false)}
        onApply={handleApplyFilters}
      />

      <UserSafetyActionSheet
        visible={isSafetyMenuVisible}
        userName={currentCandidate?.fullName || currentCandidate?.displayName}
        onClose={() => setIsSafetyMenuVisible(false)}
        onBlock={handleBlockCurrentUser}
        onReport={handleReportCurrentUser}
      />
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
  headerButtonDisabled: {
    opacity: 0.45,
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
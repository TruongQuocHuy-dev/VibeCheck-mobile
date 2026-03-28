import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme';
import type { DiscoveryFilters } from '../../domain/types/vibe-card.types';
import { fetchCandidatesEstimate } from '../../data/discovery.service';

type GenderFilter = DiscoveryFilters['gender'];

interface DiscoveryFilterSheetProps {
  visible: boolean;
  filters: DiscoveryFilters;
  onClose: () => void;
  onApply: (nextFilters: DiscoveryFilters) => void;
}

const genderOptions: Array<{ value: GenderFilter; label: string }> = [
  { value: 'all', label: 'Tat ca' },
  { value: 'female', label: 'Nu' },
  { value: 'male', label: 'Nam' },
];

const MIN_AGE = 18;
const MAX_AGE = 60;

const normalizeFilters = (raw: DiscoveryFilters): DiscoveryFilters => {
  const safeMin = Math.max(MIN_AGE, Math.min(MAX_AGE - 1, Number(raw?.minAge) || MIN_AGE));
  const safeMaxBase = Number(raw?.maxAge) || 40;
  const safeMax = Math.max(safeMin + 1, Math.min(MAX_AGE, safeMaxBase));
  const safeGender = raw?.gender === 'male' || raw?.gender === 'female' ? raw.gender : 'all';

  return {
    minAge: safeMin,
    maxAge: safeMax,
    gender: safeGender,
  };
};

export const DiscoveryFilterSheet: React.FC<DiscoveryFilterSheetProps> = ({
  visible,
  filters,
  onClose,
  onApply,
}) => {
  const [draft, setDraft] = React.useState<DiscoveryFilters>(normalizeFilters(filters));
  const [estimatedCount, setEstimatedCount] = React.useState<number | null>(null);
  const [isEstimating, setIsEstimating] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setDraft(normalizeFilters(filters));
      setEstimatedCount(null);
    }
  }, [filters, visible]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setIsEstimating(true);
      try {
        const nextCount = await fetchCandidatesEstimate(draft);
        if (!active) return;
        setEstimatedCount(nextCount);
      } catch (_error) {
        if (!active) return;
        setEstimatedCount(null);
      } finally {
        if (active) {
          setIsEstimating(false);
        }
      }
    }, 240);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [draft, visible]);

  const handleApply = React.useCallback(() => {
    onApply(draft);
    onClose();
  }, [draft, onApply, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheet}>
          <SafeAreaView edges={['bottom']}>
            <View style={styles.handleWrap}>
              <View style={styles.handle} />
            </View>
            <Text style={styles.title}>Bo loc</Text>

            <Text style={styles.sectionLabel}>Do tuoi</Text>
            <View style={styles.rangeHeader}>
              <Text style={styles.rangeText}>{draft.minAge}</Text>
              <Text style={styles.rangeDash}>-</Text>
              <Text style={styles.rangeText}>{draft.maxAge}</Text>
            </View>

            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>Truot de chon khoang tuoi</Text>
              <View style={styles.sliderWrap}>
                <MultiSlider
                  values={[draft.minAge, draft.maxAge]}
                  min={MIN_AGE}
                  max={MAX_AGE}
                  step={1}
                  allowOverlap={false}
                  snapped
                  onValuesChange={(values: number[]) => {
                    if (!Array.isArray(values) || values.length < 2) return;
                    const [nextMin, nextMax] = values;
                    setDraft((prev) => ({
                      ...prev,
                      minAge: Math.max(MIN_AGE, Math.min(nextMin, nextMax - 1)),
                      maxAge: Math.min(MAX_AGE, Math.max(nextMax, nextMin + 1)),
                    }));
                  }}
                  selectedStyle={styles.sliderSelectedTrack}
                  unselectedStyle={styles.sliderUnselectedTrack}
                  trackStyle={styles.sliderTrack}
                  markerStyle={styles.sliderMarker}
                  pressedMarkerStyle={styles.sliderMarkerPressed}
                  containerStyle={styles.sliderContainer}
                />
              </View>
            </View>

            <Text style={styles.sectionLabel}>Gioi tinh</Text>
            <View style={styles.optionRow}>
              {genderOptions.map((item) => {
                const active = draft.gender === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => setDraft((prev) => ({ ...prev, gender: item.value }))}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.estimateWrap}>
              <Text style={styles.estimateText}>
                {isEstimating
                  ? 'Dang uoc tinh ket qua...'
                  : `Uoc tinh: ${estimatedCount ?? '--'} ket qua phu hop`}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelText}>Huy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.applyBtn]} onPress={handleApply}>
                <Text style={styles.applyText}>Ap dung</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.overlayBorder,
  },
  handleWrap: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    alignSelf: 'center',
    backgroundColor: colors.overlayBorder,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity80,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rangeText: {
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  rangeDash: {
    marginHorizontal: spacing.sm,
    color: colors.textOpacity60,
    fontSize: typography.sizes.md,
  },
  sliderSection: {
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textOpacity60,
    marginBottom: 2,
  },
  sliderWrap: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  sliderContainer: {
    height: 36,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 999,
  },
  sliderSelectedTrack: {
    backgroundColor: colors.neonCyan,
  },
  sliderUnselectedTrack: {
    backgroundColor: colors.overlayBorder,
  },
  sliderMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.neonCyan,
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  sliderMarkerPressed: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.overlayLight,
  },
  pillActive: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,255,255,0.12)',
  },
  pillText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.neonCyan,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  estimateWrap: {
    marginBottom: spacing.xs,
    paddingVertical: spacing.sm,
  },
  estimateText: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity80,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.overlayLight,
  },
  applyBtn: {
    backgroundColor: colors.neonCyan,
  },
  cancelText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  applyText: {
    color: colors.bgDark,
    fontWeight: '700',
  },
});

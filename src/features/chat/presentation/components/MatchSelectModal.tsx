import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';
import { useMatchSelect } from '../../application/hooks/useMatchSelect';
import { NewMatchUser } from '../../../matches/domain/types/matches.types';

interface MatchSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (user: NewMatchUser) => void;
}

export const MatchSelectModal: React.FC<MatchSelectModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();
  const { matches, loading, searchQuery, setSearchQuery, handleSelect } = useMatchSelect(onSelect);

  const renderItem = ({ item }: { item: NewMatchUser }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => {
        handleSelect(item);
        onClose();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineStatus} />}
      </View>
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}</Text>
        <Text style={styles.matchStatus}>{item.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.iconMuted} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="close" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bắt đầu trò chuyện</Text>
          <View style={{ width: 44 }} /> 
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm kiếm người đã ghép đôi..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        {loading && matches.length === 0 ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color={colors.messengerBlue} size="large" />
          </View>
        ) : (
          <FlatList
            data={matches}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + spacing.xl }
            ]}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyWrapper}>
                  <Icon name="people-outline" size={60} color={colors.iconMuted} />
                  <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
                  <Text style={styles.emptySubtitle}>Hãy thử tìm kiếm theo tên khác nhé!</Text>
                </View>
              ) : null
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayBorder,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700',
    color: colors.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteOpacity10,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: br.lg,
    height: 48,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surfaceMedium,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.neonGreen,
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  matchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    fontWeight: '600',
    color: colors.white,
    marginBottom: 2,
  },
  matchStatus: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
    color: colors.textSecondary,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: colors.white,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  separator: {
    height: 1,
    backgroundColor: colors.overlayBorder,
    marginLeft: 70,
  },
});

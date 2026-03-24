import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFeed } from '../../application/hooks/useFeed';
import { PostCard } from '../components/PostCard';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme';
import type { Post } from '../../domain/types/post.types';

// TODO: Replace with real currentUserId from auth context/store
const PLACEHOLDER_USER_ID = null;

export const FeedScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    posts,
    loading,
    refreshing,
    error,
    handleLike,
    handleComment,
    handleCreatePost,
    handleRefresh,
    handleLoadMore,
  } = useFeed(PLACEHOLDER_USER_ID);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [posting, setPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const handleSubmitPost = useCallback(async () => {
    if (!newPostText.trim()) return;
    setPosting(true);
    try {
      await handleCreatePost(newPostText.trim());
      setNewPostText('');
      setCreateModalVisible(false);
    } finally {
      setPosting(false);
    }
  }, [newPostText, handleCreatePost]);

  const handleSubmitComment = useCallback(async () => {
    if (!selectedPost || !commentText.trim()) return;
    setCommenting(true);
    try {
      await handleComment(selectedPost._id, commentText.trim());
      setCommentText('');
    } finally {
      setCommenting(false);
    }
  }, [selectedPost, commentText, handleComment]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        currentUserId={PLACEHOLDER_USER_ID}
        onLike={handleLike}
        onCommentPress={setSelectedPost}
      />
    ),
    [handleLike]
  );

  const keyExtractor = useCallback((item: Post) => item._id, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator size="large" color={colors.neonCyan} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBE FEED</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Icon name="add" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Error banner */}
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Feed List */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 90 + insets.bottom },
        ]}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="flame-outline" size={48} color={colors.textOpacity60} />
            <Text style={styles.emptyText}>Chưa có bài viết nào.{'\n'}Hãy chia sẻ vibe của bạn!</Text>
          </View>
        }
      />

      {/* Create Post Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo bài viết</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.postInput}
              placeholder="Bạn đang nghĩ gì vậy? ✨"
              placeholderTextColor={colors.textOpacity60}
              multiline
              value={newPostText}
              onChangeText={setNewPostText}
              maxLength={500}
            />
            <View style={styles.modalActions}>
              <Text style={styles.charCount}>{newPostText.length}/500</Text>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!newPostText.trim() || posting) && styles.submitDisabled,
                ]}
                onPress={handleSubmitPost}
                disabled={!newPostText.trim() || posting}
              >
                {posting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.submitText}>Đăng</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Comment Modal */}
      <Modal
        visible={!!selectedPost}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPost(null)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bình luận</Text>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <Icon name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.postInput}
              placeholder="Viết bình luận..."
              placeholderTextColor={colors.textOpacity60}
              value={commentText}
              onChangeText={setCommentText}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!commentText.trim() || commenting) && styles.submitDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || commenting}
              >
                {commenting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.submitText}>Gửi</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  loader: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.overlayBorder,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.neonCyan,
    letterSpacing: 1,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neonPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: colors.error,
    padding: spacing.sm,
    alignItems: 'center',
  },
  errorText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    color: colors.textOpacity60,
    textAlign: 'center',
    fontSize: typography.sizes.md,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.blurDark,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  postInput: {
    backgroundColor: colors.overlayLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  charCount: {
    color: colors.textOpacity60,
    fontSize: typography.sizes.xs,
  },
  submitButton: {
    backgroundColor: colors.neonPink,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    minWidth: 80,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.md,
  },
});

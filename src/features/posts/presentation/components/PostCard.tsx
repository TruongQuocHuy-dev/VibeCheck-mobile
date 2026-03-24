import React, { memo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme';
import type { Post } from '../../domain/types/post.types';

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  onLike: (postId: string) => void;
  onCommentPress: (post: Post) => void;
}

const PostCardComp: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onCommentPress,
}) => {
  const [showingAllComments, setShowingAllComments] = useState(false);

  const isLiked = currentUserId
    ? post.likes.includes(currentUserId)
    : false;

  const formatTime = useCallback((dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ`;
    return `${Math.floor(hours / 24)} ngày`;
  }, []);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {post.user.avatar ? (
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Icon name="person" size={24} color={colors.textOpacity60} />
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{post.user.displayName}</Text>
          {post.vibe ? (
            <Text style={styles.vibeBadge}>✨ {post.vibe}</Text>
          ) : null}
          <Text style={styles.timestamp}>{formatTime(post.createdAt)}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Media */}
      {post.media ? (
        <Image source={{ uri: post.media }} style={styles.media} resizeMode="cover" />
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(post._id)}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? colors.neonPink : colors.textOpacity60}
          />
          <Text style={[styles.actionCount, isLiked && styles.likedText]}>
            {post.likes.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onCommentPress(post)}>
          <Icon name="chatbubble-outline" size={20} color={colors.textOpacity60} />
          <Text style={styles.actionCount}>{post.comments.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments preview */}
      {post.comments.length > 0 && (
        <View style={styles.commentsSection}>
          {(showingAllComments ? post.comments : post.comments.slice(-2)).map((c) => (
            <View key={c._id} style={styles.commentRow}>
              <Text style={styles.commentUser}>{c.user.displayName}: </Text>
              <Text style={styles.commentText}>{c.text}</Text>
            </View>
          ))}
          {post.comments.length > 2 && !showingAllComments && (
            <TouchableOpacity onPress={() => setShowingAllComments(true)}>
              <Text style={styles.showMore}>Xem thêm {post.comments.length - 2} bình luận</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export const PostCard = memo(PostCardComp);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.neonCyan,
  },
  avatarPlaceholder: {
    backgroundColor: colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  vibeBadge: {
    fontSize: typography.sizes.xs,
    color: colors.neonCyan,
    marginTop: 2,
  },
  timestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textOpacity60,
    marginTop: 2,
  },
  content: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.overlayBorder,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  actionCount: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity60,
  },
  likedText: {
    color: colors.neonPink,
  },
  commentsSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    gap: spacing.xs,
  },
  commentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commentUser: {
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
  },
  commentText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    flex: 1,
  },
  showMore: {
    color: colors.neonCyan,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});

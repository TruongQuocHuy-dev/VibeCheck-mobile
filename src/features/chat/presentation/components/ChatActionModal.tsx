import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';

interface ChatActionModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: 'pin' | 'unpin' | 'unread' | 'block' | 'delete') => void;
  isPinned: boolean;
  isBlocked: boolean;
  userName: string;
}

export const ChatActionModal: React.FC<ChatActionModalProps> = ({
  visible,
  onClose,
  onAction,
  isPinned,
  isBlocked,
  userName,
}) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1)),
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setShouldRender(false);
      });
    }
  }, [visible, animation]);

  if (!shouldRender) return null;

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  return (
    <Animated.View 
      style={[styles.root, { opacity: backdropOpacity }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.menuContainer, 
                { transform: [{ scale: menuScale }] }
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.headerText} numberOfLines={1}>
                  {userName}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  onAction(isPinned ? 'unpin' : 'pin');
                  onClose();
                }}
              >
                <Text style={styles.actionText}>{isPinned ? 'Bỏ ghim' : 'Ghim'}</Text>
                <Icon
                  name={isPinned ? 'pin-outline' : 'pin'}
                  size={22}
                  color={colors.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  onAction('unread');
                  onClose();
                }}
              >
                <Text style={styles.actionText}>Đánh dấu chưa đọc</Text>
                <Icon name="mail-unread-outline" size={22} color={colors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  onAction('block');
                  onClose();
                }}
              >
                <Text style={[styles.actionText, { color: isBlocked ? colors.neonGreen : colors.error }]}>
                  {isBlocked ? 'Bỏ chặn' : 'Chặn'}
                </Text>
                <Icon 
                  name={isBlocked ? 'checkmark-circle-outline' : 'close-circle-outline'} 
                  size={22} 
                  color={isBlocked ? colors.neonGreen : colors.error} 
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionItem, styles.lastItem]}
                onPress={() => {
                  onAction('delete');
                  onClose();
                }}
              >
                <Text style={[styles.actionText, { color: colors.error }]}>Xóa</Text>
                <Icon name="trash-outline" size={22} color={colors.error} />
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  menuContainer: {
    width: '100%',
    backgroundColor: colors.surfaceHigh,
    borderRadius: borderRadius.radius_modal,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  headerText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

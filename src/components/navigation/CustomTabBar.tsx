import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../core/theme/colors';
import { useUnreadCount } from '../../shared/providers/UnreadProvider';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { totalUnread } = useUnreadCount();

  const handleCreateVibePress = () => {
    navigation.getParent()?.navigate('CreateVibe' as never);
  };

  const renderTab = (route: typeof state.routes[0], index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    let iconName = 'home-outline';
    let label = 'Tab';
    let showBadge = false;

    if (route.name === 'Discovery') {
      iconName = isFocused ? 'sparkles' : 'sparkles-outline';
      label = 'Discovery';
    } else if (route.name === 'Matches') {
      iconName = isFocused ? 'heart' : 'heart-outline';
      label = 'Matches';
    } else if (route.name === 'Chat') {
      iconName = isFocused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
      label = 'Chat';
      showBadge = totalUnread > 0;
    } else if (route.name === 'Profile') {
      iconName = isFocused ? 'person' : 'person-outline';
      label = 'Profile';
    }

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabItem}
      >
        <View>
          <Icon 
            name={iconName} 
            size={24} 
            color={isFocused ? colors.primary : colors.textSecondary} 
          />
          {showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalUnread > 99 ? '99+' : totalUnread}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color: isFocused ? colors.primary : colors.textSecondary }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Split: [Discovery, Matches] | FAB | [Chat, Profile]
  const firstHalf = state.routes.slice(0, 2);
  const secondHalf = state.routes.slice(2);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10, height: 70 + insets.bottom }]}>
      {firstHalf.map((route, index) => renderTab(route, index))}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={handleCreateVibePress}
      >
        <Icon name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {secondHalf.map((route, index) => renderTab(route, index + 2))}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardDark || '#1A1A2E',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 15,
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.neonPink || '#FF0099',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.cardDark || '#1A1A2E',
    zIndex: 10,
    elevation: 4,
  },
  badgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary || '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: colors.primary || '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 4,
    borderColor: colors.bgDark || '#0F0F1A',
  },
});
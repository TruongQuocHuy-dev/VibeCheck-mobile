import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients } from '../../constants/colors';
import { spacing } from '../../constants/spacing';


interface CreateVibeFABProps {
  onPress: () => void;
}

export const CreateVibeFAB: React.FC<CreateVibeFABProps> = ({ onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.9); };
  const handlePressOut = () => { scale.value = withSpring(1); };
  const handlePress = () => {
    scale.value = withSequence(withSpring(0.9), withTiming(1, { duration: 200 }));
    onPress();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.pressable}>
        <LinearGradient colors={[...gradients.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
          <Icon name="add" size={32} color="#fff" />
        </LinearGradient>
      </Pressable>
      <View style={styles.glow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  gradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
});
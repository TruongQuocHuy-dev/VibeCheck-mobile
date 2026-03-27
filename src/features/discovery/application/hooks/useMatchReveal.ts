import React from 'react';
import { Dimensions } from 'react-native';
import { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const useMatchReveal = () => {
  const leftX = useSharedValue(-width);
  const rightX = useSharedValue(width);
  const scalePulse = useSharedValue(1);

  React.useEffect(() => {
    leftX.value = withDelay(0, withSpring(0, { damping: 14, stiffness: 115 }));
    rightX.value = withDelay(0, withSpring(0, { damping: 14, stiffness: 115 }));
    scalePulse.value = withRepeat(withTiming(1.08, { duration: 1200 }), -1, true);
  }, []);

  const leftAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftX.value }],
  }));

  const rightAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightX.value }],
  }));

  const pulseTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scalePulse.value }],
  }));

  return {
    leftAnimatedStyle,
    rightAnimatedStyle,
    pulseTextStyle,
  };
};

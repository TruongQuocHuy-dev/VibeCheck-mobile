import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { UseWelcomeAnimationsReturn } from '../../domain/types/welcome-animations.types';

/** Core hook xử lý Floating & Pulsing animations cho Welcome screen */
export const useWelcomeAnimations = (): UseWelcomeAnimationsReturn => {
  const floatValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    floatValue.value = withRepeat(
      withTiming(1, { duration: 2500 }),
      -1,
      true
    );
    pulseValue.value = withRepeat(
      withTiming(1.05, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatValue.value * -10 }],
    };
  });

  const pulsingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });

  return { floatingStyle, pulsingStyle };
};

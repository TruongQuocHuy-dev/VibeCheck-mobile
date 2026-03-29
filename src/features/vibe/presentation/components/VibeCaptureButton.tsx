import React from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../core/theme/colors';

interface VibeCaptureButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const VibeCaptureButton: React.FC<VibeCaptureButtonProps> = ({ onPress, disabled }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={styles.container}
    >
      <Animated.View style={[styles.outerRing, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[colors.vibeCyan, colors.vibePurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.middleShield}>
            <View style={styles.innerCircle} />
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 4,
    backgroundColor: 'transparent',
    shadowColor: colors.vibePurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 36,
    padding: 4,
  },
  middleShield: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  innerCircle: {
    flex: 1,
    width: '100%',
    borderRadius: 26,
    backgroundColor: colors.white,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});

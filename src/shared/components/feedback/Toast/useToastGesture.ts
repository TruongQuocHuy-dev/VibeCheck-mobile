import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 50;
const DURATION = 300;

export const useToastGesture = (visible: boolean, onDismiss: () => void) => {
  const [mounted, setMounted] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: -100 })).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Track if we are swiped out to avoid running default fade-out animation from the original position
  const isSwipedOut = useRef(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      isSwipedOut.current = false;
      
      Animated.parallel([
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          bounciness: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      if (isSwipedOut.current) {
        // If it was swiped out, just update mounted safely without animating back
        setMounted(false);
      } else {
        // Normal fade out
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(pan.y, {
            toValue: -100, // Slide up
            duration: DURATION,
            useNativeDriver: true,
          }),
        ]).start(() => setMounted(false));
      }
    }
  }, [visible, pan, opacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger if horizontal movement is greater than vertical
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          // Complete swipe out of screen
          isSwipedOut.current = true;
          Animated.timing(pan.x, {
            toValue: gestureState.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onDismiss();
          });
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            bounciness: 10,
          }).start();
        }
      },
    })
  ).current;

  return { mounted, pan, opacity, panResponder };
};

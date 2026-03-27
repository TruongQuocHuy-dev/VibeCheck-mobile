import { useState, useRef, useCallback, useEffect } from 'react';
import { Dimensions, PanResponder } from 'react-native';
import {
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { submitSwipe } from '../../data/discovery.service';
import type { Candidate, MatchResult } from '../../domain/types/vibe-card.types';
import { onSocketEvent, offSocketEvent } from '../../../../infrastructure/services/socket.service';

const { width } = Dimensions.get('window');

interface UseDiscoveryDetailReturn {
  currentCandidate: Candidate | undefined;
  nextCandidate: Candidate | undefined;
  swipe: (type: 'like' | 'dislike') => void;
  panHandlers: ReturnType<typeof PanResponder.create>['panHandlers'];
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  backgroundCardStyle: ReturnType<typeof useAnimatedStyle>;
  tintStyle: ReturnType<typeof useAnimatedStyle>;
  skipStyle: ReturnType<typeof useAnimatedStyle>;
  likeStyle: ReturnType<typeof useAnimatedStyle>;
  matchResult: MatchResult | null;
  isSwiping: boolean;
  dismissMatch: () => void;
}

export const useDiscoveryDetail = (
  candidates: Candidate[],
  initialIndex: number,
  onEnd: () => void
): UseDiscoveryDetailReturn => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchQueue, setMatchQueue] = useState<NonNullable<MatchResult['match']>[]>([]);
  const [isSwiping, setIsSwiping] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const currentCandidate = candidates[currentIndex];
  const nextCandidate = candidates[currentIndex + 1];

  const enqueueMatch = useCallback((match: MatchResult['match']) => {
    if (!match) return;

    setMatchQueue((prev) => {
      const existsInQueue = prev.some((item) => item.conversationId === match.conversationId);
      const isCurrent = matchResult?.match?.conversationId === match.conversationId;

      if (existsInQueue || isCurrent) {
        return prev;
      }

      return [...prev, match];
    });
  }, [matchResult?.match?.conversationId]);

  useEffect(() => {
    if (!matchResult && matchQueue.length > 0) {
      setMatchResult({ isMatch: true, match: matchQueue[0] });
    }
  }, [matchResult, matchQueue]);

  useEffect(() => {
    const handleNewMatch = (payload: MatchResult['match']) => {
      if (!payload) return;
      enqueueMatch(payload);
    };

    onSocketEvent<MatchResult['match']>('new_match', handleNewMatch);

    return () => {
      offSocketEvent<MatchResult['match']>('new_match', handleNewMatch);
    };
  }, [enqueueMatch]);

  const resetAnimation = () => {
    translateX.value = 0;
    rotate.value = 0;
    opacity.value = 1;
    translateY.value = 0;
  };

  const goNext = useCallback(() => {
    if (currentIndex >= candidates.length - 1) {
      onEnd();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    resetAnimation();
  }, [currentIndex, candidates.length, onEnd]);

  const animateSwipeOut = useCallback(
    (type: 'like' | 'dislike') => {
      const toValue = type === 'like' ? width : -width;
      const rotateVal = type === 'like' ? 15 : -15;

      translateX.value = withTiming(toValue, { duration: 260 });
      rotate.value = withTiming(rotateVal, { duration: 260 });
      opacity.value = withTiming(0, { duration: 260 }, () => {
        runOnJS(goNext)();
      });
    },
    [goNext, translateX, rotate, opacity]
  );

  const swipe = useCallback(
    (type: 'like' | 'dislike') => {
      if (isSwiping || !currentCandidate) return;

      if (type === 'like') {
        if (currentCandidate.hasLikedMe) {
          // Reciprocal-like candidate: prioritize immediate MatchReveal, no swipe-out animation.
          translateX.value = withTiming(0, { duration: 80 });
          rotate.value = withTiming(0, { duration: 80 });

          setIsSwiping(true);
          submitSwipe(currentCandidate._id, 'like')
            .then((result) => {
              console.log('Swipe Like Result:', result);
              if (result.isMatch && result.match) {
                console.log('MATCH DETECTED in DiscoveryDetail!');
                enqueueMatch(result.match);
                return;
              }

              // Fallback: if backend no longer returns match, keep normal flow.
              animateSwipeOut('like');
            })
            .catch((err) => {
              console.warn('Swipe Like API error:', err);
              resetAnimation();
            })
            .finally(() => setIsSwiping(false));

          return;
        }

        // Normal case (A likes first): keep smooth swipe-right animation.
        animateSwipeOut('like');
        submitSwipe(currentCandidate._id, 'like')
          .then((result) => {
            if (result.isMatch && result.match) {
              setMatchResult(result);
            }
          })
          .catch((err) => {
            console.warn('Swipe Like API error:', err);
          });
      } else {
        animateSwipeOut('dislike');
        submitSwipe(currentCandidate._id, 'dislike').catch((err) =>
          console.warn('Swipe API error:', err)
        );
      }
    },
    [currentCandidate, isSwiping, animateSwipeOut, translateX, rotate, enqueueMatch]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => {
        translateX.value = g.dx;
        rotate.value = g.dx / 20;
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > 100) swipe('like');
        else if (g.dx < -100) swipe('dislike');
        else {
          translateX.value = withTiming(0);
          rotate.value = withTiming(0);
        }
      },
    })
  ).current;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
    zIndex: 2,
  }));

  const backgroundCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.5],
      [0.93, 1],
      'clamp'
    );
    const ty = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.5],
      [15, 0],
      'clamp'
    );
    return {
      transform: [{ scale }, { translateY: ty }],
      opacity: interpolate(Math.abs(translateX.value), [0, width * 0.5], [0.8, 1], 'clamp'),
      zIndex: 1,
    };
  });

  const tintStyle = useAnimatedStyle(() => {
    const tintOpacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.4],
      [0, 0.4],
      'clamp'
    );
    const bgColor = interpolateColor(
      translateX.value,
      [-width * 0.2, 0, width * 0.2],
      ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0)', 'rgba(255,105,180,0.4)']
    );
    return { backgroundColor: bgColor, opacity: tintOpacity };
  });

  const skipStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [-width * 0.3, 0], [1.2, 1], 'clamp');
    return { transform: [{ scale }] };
  });

  const likeStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [0, width * 0.3], [1, 1.2], 'clamp');
    return { transform: [{ scale }] };
  });

  return {
    currentCandidate,
    nextCandidate,
    swipe,
    panHandlers: panResponder.panHandlers,
    animatedStyle,
    backgroundCardStyle,
    tintStyle,
    skipStyle,
    likeStyle,
    matchResult,
    isSwiping,
    dismissMatch: useCallback(() => {
      setMatchResult(null);
      setMatchQueue((prev) => prev.slice(1));
    }, []),
  };
};
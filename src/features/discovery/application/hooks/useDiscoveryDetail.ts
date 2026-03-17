import { useState, useRef } from 'react';
import { Dimensions, PanResponder } from 'react-native';
import {
    useSharedValue,
    withTiming,
    runOnJS,
    useAnimatedStyle,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';
import { VibeCard } from '../../domain/types/vibe-card.types';

const { width } = Dimensions.get('window');

export const useDiscoveryDetail = (cards: VibeCard[], initialIndex: number, onEnd: () => void) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);

    const currentCard = cards[currentIndex];
    const nextCard = cards[currentIndex + 1];

    const resetAnimation = () => {
        translateX.value = 0;
        rotate.value = 0;
        opacity.value = 1;
        translateY.value = 0;
    };

    const goNext = () => {
        if (currentIndex >= cards.length - 1) {
            onEnd();
        } else {
            setCurrentIndex(prev => prev + 1);
            resetAnimation();
        }
    };

    const swipe = (type: 'like' | 'skip') => {
        const toValue = type === 'like' ? width : -width;
        const rotateVal = type === 'like' ? 15 : -15;

        translateX.value = withTiming(toValue, { duration: 300 });
        rotate.value = withTiming(rotateVal, { duration: 300 });

        opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(goNext)();
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
            onPanResponderMove: (_, g) => {
                translateX.value = g.dx;
                rotate.value = g.dx / 20;
            },
            onPanResponderRelease: (_, g) => {
                if (g.dx > 100) swipe('like');
                else if (g.dx < -100) swipe('skip');
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
        const opacity = interpolate(
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
        return {
            backgroundColor: bgColor,
            opacity,
        };
    });

    const skipStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            [-width * 0.3, 0],
            [1.2, 1],
            'clamp'
        );
        return { transform: [{ scale }] };
    });

    const likeStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            [0, width * 0.3],
            [1, 1.2],
            'clamp'
        );
        return { transform: [{ scale }] };
    });

    return {
        currentCard,
        nextCard,
        swipe,
        panHandlers: panResponder.panHandlers,
        animatedStyle,
        backgroundCardStyle,
        tintStyle,
        skipStyle,
        likeStyle,
    };
};
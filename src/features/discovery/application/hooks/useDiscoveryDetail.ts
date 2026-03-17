import { useState } from 'react';
import { Dimensions } from 'react-native';
import {
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const useDiscoveryDetail = (cards: any[], initialIndex: number, onEnd: () => void) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);

    const currentCard = cards[currentIndex];

    const resetAnimation = () => {
        translateX.value = 0;
        rotate.value = 0;
        opacity.value = 1;

        translateY.value = height * 0.5;
        translateY.value = withTiming(0, { duration: 400 });
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

    return {
        currentCard,
        translateX,
        translateY,
        rotate,
        opacity,
        swipe,
        setTranslateX: (val: number) => (translateX.value = val),
        setRotate: (val: number) => (rotate.value = val),
    };
};
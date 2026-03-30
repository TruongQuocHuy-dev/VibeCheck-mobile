import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
} from 'react-native-vision-camera';

export type FlashMode = 'off' | 'on' | 'auto';
export type CameraFacing = 'back' | 'front';

export const useVibeCameraView = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);

  const cameraRef = useRef<Camera>(null);

  // Request permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    // Flash only works on back camera
    setFlash('off');
  }, []);

  const toggleFlash = useCallback(() => {
    if (facing === 'front') return; // no flash on front cam
    setFlash((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  }, [facing]);

  const takePhoto = useCallback(async (): Promise<PhotoFile | null> => {
    if (!cameraRef.current || !isCameraReady) return null;
    try {
      const photo = await cameraRef.current.takePhoto({
        flash,
        enableShutterSound: true,
      });
      setCapturedPhoto(photo);
      return photo;
    } catch (err) {
      console.error('[useVibeCameraView] takePhoto error:', err);
      return null;
    }
  }, [flash, isCameraReady]);

  const resetPhoto = useCallback(() => {
    setCapturedPhoto(null);
  }, []);

  const device = useCameraDevice(facing);

  return {
    cameraRef,
    device,
    hasPermission,
    requestPermission,
    flash,
    facing,
    isCameraReady,
    capturedPhoto,
    setIsCameraReady,
    takePhoto,
    resetPhoto,
    toggleFacing,
    toggleFlash,
  };
};

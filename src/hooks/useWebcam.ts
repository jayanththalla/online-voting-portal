import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { WebcamProps } from 'react-webcam';
import type { ComponentType } from 'react';
import Webcam from 'react-webcam';

// Dynamically import Webcam with SSR disabled
const WebcamComponent = dynamic<WebcamProps>(() => import('react-webcam').then(mod => mod.default) as Promise<ComponentType<WebcamProps>>, {
  ssr: false,
});

const videoConstraints: MediaTrackConstraints = {
  width: 720,
  height: 720,
  facingMode: 'user',
};

export function useWebcam() {
  const [isClient, setIsClient] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImgSrc(screenshot);
      return screenshot;
    }
    return null;
  }, [webcamRef]);

  const retake = useCallback(() => {
    setImgSrc(null);
  }, []);

  return {
    isClient,
    WebcamComponent,
    videoConstraints,
    webcamRef,
    imgSrc,
    setImgSrc,
    capture,
    retake,
  };
} 
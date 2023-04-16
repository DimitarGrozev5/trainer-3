import { useCallback, useEffect, useRef, useState } from "react";

export const useVirtualScrollProgress = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Get container height
  const [viewportHeight, setViewportHeight] = useState(100);
  useEffect(() => {
    if (containerRef.current) {
      setViewportHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Set virtual scroll progress
  const [stableProgress, setStableProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Setup state to store the touch start position, or -1 if there is no touch
  // currently being tracked. This is used to calculate the scroll progress.
  const [touchStarted, setTouchStarted] = useState(-1);

  // Set Event Listener to update scroll progress based on user touch event
  useEffect(() => {
    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.changedTouches[0] ? e.changedTouches[0].clientY : -1;
      setTouchStarted(touchY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStarted >= 0) {
        const touchY = e.changedTouches[0]
          ? e.changedTouches[0].clientY
          : touchStarted;
        const progress = (touchStarted - touchY) / viewportHeight;

        const nextProgress = Math.max(
          Math.min(stableProgress + progress, 1),
          0
        );

        setStableProgress(nextProgress);
        setScrollProgress(nextProgress);

        setTouchStarted(-1);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStarted >= 0) {
        const touchY = e.changedTouches[0]
          ? e.changedTouches[0].clientY
          : touchStarted;
        const progress = (touchStarted - touchY) / viewportHeight;

        const nextProgress = Math.max(
          Math.min(stableProgress + progress, 1),
          0
        );

        setScrollProgress(nextProgress);
      }
    };

    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
      container.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [stableProgress, touchStarted, viewportHeight]);

  // Function to set virtual scroll progress
  const setScroll = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  return { containerRef, scrollProgress, setScroll };
};

import { useAnimate } from "framer-motion";
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

  /// Set virtual scroll progress
  // scrollProgress is the value that is exposed from the hook
  // It changes both during scrolling and when animations are active
  const [scrollProgress, setScrollProgress] = useState(0);

  // stableProgress is the value that percists during active scrolling
  // const [stableProgress, setStableProgress] = useState(0);
  const stableProgress = useRef(0);

  // animationProgress is the value that is used to animate scroll changes
  const [animationProgress, setAnimationProgress] = useState<number | null>(
    null
  );

  // Setup state to store the touch start position, or -1 if there is no touch
  // currently being tracked. This is used to calculate the scroll progress.
  const [touchStarted, setTouchStarted] = useState(-1);

  // Set Event Listener to update scroll progress based on user touch event
  useEffect(() => {
    const container = containerRef.current;

    // Get initial scroll position
    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.changedTouches[0] ? e.changedTouches[0].clientY : -1;
      setTouchStarted(touchY);
    };

    // Calculate final scroll position when the user stops scrolling
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStarted >= 0) {
        const touchY = e.changedTouches[0]
          ? e.changedTouches[0].clientY
          : touchStarted;
        const progress = (touchStarted - touchY) / viewportHeight;

        const nextProgress = Math.max(
          Math.min(stableProgress.current + progress, 1),
          0
        );

        stableProgress.current = nextProgress;
        setScrollProgress(nextProgress);
        setAnimationProgress(null);

        setTouchStarted(-1);
      }
    };

    // Calculate  temporary scroll position, based on touch position and stableScroll
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStarted >= 0) {
        const touchY = e.changedTouches[0]
          ? e.changedTouches[0].clientY
          : touchStarted;
        const progress = (touchStarted - touchY) / viewportHeight;

        const nextProgress = Math.max(
          Math.min(stableProgress.current + progress, 1),
          0
        );

        setScrollProgress(nextProgress);
      }
    };

    // Add event listeners
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
      container.addEventListener("touchmove", handleTouchMove);
    }

    // Remove event listeners on dismount
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [touchStarted, viewportHeight]);

  // Function to set virtual scroll progress
  const setScroll = useCallback(
    (progress: number) => {
      if (touchStarted < 0) {
        setAnimationProgress(progress);
      }
    },
    [touchStarted]
  );

  const [, animate] = useAnimate();

  /// Handle animation
  useEffect(() => {
    console.log(animationProgress, stableProgress.current);

    if (
      animationProgress !== stableProgress.current &&
      animationProgress !== null
    ) {
      void animate(stableProgress.current, animationProgress, {
        duration: 0.2,
        ease: "easeInOut",
        onUpdate: (v) => {
          setScrollProgress(v);
        },
      }).then(() => {
        stableProgress.current = animationProgress;
      });
    }
  }, [animate, animationProgress]);

  return {
    containerRef,
    scrollProgress,
    isTouching: touchStarted >= 0,
    setScroll,
  };
};

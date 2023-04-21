import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ScrollSnap = {
  id: string;
  test: () => boolean;
  to: () => number;
};

export const useGlobalScroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep track when the user is touching the screen
  const [isTouching, setIsTouching] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollLocked = useMemo(
    () => isTouching || isAutoScrolling,
    [isAutoScrolling, isTouching]
  );

  // Function to animate scrolling
  const scrollTo = useCallback(
    (position: number) => {
      if (!scrollLocked && containerRef.current) {
        containerRef.current.scrollTop = position;
      }
    },
    [scrollLocked]
  );

  // Setup event listeners for touch events
  const touchStart = () => {
    setIsTouching(true);
    setIsAutoScrolling(true);
  };
  const touchEnd = () => {
    setIsTouching(false);
  };

  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const onScroll = () => {
    // Clear previous timeout
    clearTimeout(scrollTimeoutRef.current);

    // Add timeout to clear scroll state
    scrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(false);
    }, 30);
  };

  // Attach event listeners to container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", touchStart);
      container.addEventListener("touchend", touchEnd);
      container.addEventListener("scroll", onScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", touchStart);
        container.removeEventListener("touchend", touchEnd);
        container.removeEventListener("scroll", onScroll);
      }
    };
  }, []);

  // Setup scroll snapping

  // List of scroll snap requests
  const [snapRequests, setSnapRequests] = useState<ScrollSnap[]>([]);

  // Add scroll snap request
  const addSnapRequest = useCallback(
    (id: string, test: () => boolean, to: () => number) => {
      setSnapRequests((prev) => [...prev, { id, test, to }]);
    },
    []
  );
  // Remove scroll snap request
  const removeSnapRequest = useCallback((id: string) => {
    setSnapRequests((prev) => prev.filter((snap) => snap.id !== id));
  }, []);

  useEffect(() => {
    if (!scrollLocked) {
      snapRequests.forEach((snap) => {
        if (snap.test()) {
          scrollTo(snap.to());
        }
      });
    }
  }, [scrollLocked, scrollTo, snapRequests]);

  return { containerRef, addSnapRequest, removeSnapRequest };
};

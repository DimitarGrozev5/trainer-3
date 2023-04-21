import { useScroll, useTransform } from "framer-motion";
import { useEffect, useId, useRef } from "react";

export const useScheduleScroll = (
  containerRef: React.RefObject<HTMLDivElement>,
  addSnapRequest: (id: string, test: () => boolean, to: () => number) => void,
  removeSnapRequest: (id: string) => void
) => {
  const calendarId = useId();

  const spacerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start end", "end end"],
    layoutEffect: false,
  });

  const calendarTop = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8244325767690254, 1],
    ["0vh", "0vh", "0vh", "30vh"]
  );
  const calendarHeight = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8244325767690254, 1],
    [
      "calc(60vh - 1rem)",
      "calc(60vh - 1rem)",
      "calc(100vh - 3rem)",
      "calc(70vh - 3rem)",
    ]
  );

  // useEffect(() => {
  //   return scrollYProgress.on("change", (latest) => {
  //     console.log(latest);
  //   });
  // }, [scrollYProgress]);

  useEffect(() => {
    const to = () => {
      if (!spacerRef.current) {
        return 0;
      }

      const getOffsetTopRelativeToContainer = (
        offsetTop: number,
        elem: HTMLElement
      ): number => {
        const offset = elem.offsetTop;
        const offsetParent = elem.offsetParent as HTMLElement | null;
        if (!offsetParent) return offsetTop + offset;

        if (offsetParent?.tagName !== "body") {
          return getOffsetTopRelativeToContainer(
            offsetTop + offset,
            offsetParent
          );
        }
        return offsetTop + offset;
      };

      const offsetTop = getOffsetTopRelativeToContainer(0, spacerRef.current);

      return (
        offsetTop -
        3 * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    };
    addSnapRequest(
      calendarId,
      () =>
        scrollYProgress.get() > 0.8244325767690254 &&
        scrollYProgress.get() < 0.9,
      to
    );

    addSnapRequest(
      calendarId,
      () => scrollYProgress.get() >= 0.9 && scrollYProgress.get() < 1,
      () => spacerRef.current?.getBoundingClientRect().height ?? 0
    );

    return () => {
      removeSnapRequest(calendarId);
    };
  }, [addSnapRequest, calendarId, removeSnapRequest, scrollYProgress]);

  return { calendarTop, calendarHeight, spacerRef };
};

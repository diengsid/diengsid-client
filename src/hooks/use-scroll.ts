import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down";

export function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<ScrollDirection>("down");
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // scroll position
      setScrollY(currentScrollY);

      // direction
      if (currentScrollY > lastScrollY) {
        setDirection("down");
      } else {
        setDirection("up");
      }

      // detect bottom
      const isReachedBottom =
        window.innerHeight + currentScrollY >= document.body.offsetHeight - 10;

      setIsBottom(isReachedBottom);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    scrollY,
    direction,
    isBottom,
  };
}

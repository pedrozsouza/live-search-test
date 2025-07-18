import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isEnabled: boolean;
  rootElement?: HTMLElement | null;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isEnabled,
  rootElement = null,
}: UseInfiniteScrollProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (!isEnabled || observerRef.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0,
      rootMargin: "50px",
      root: rootElement,
    });

    observerRef.current = observer;

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection, isEnabled, rootElement]);

  useEffect(() => {
    const observer = observerRef.current;
    const trigger = triggerRef.current;

    if (!observer || !trigger) return;

    if (!isEnabled || !hasNextPage || isFetchingNextPage) {
      observer.unobserve(trigger);
      return;
    }

    observer.observe(trigger);

    return () => {
      observer.unobserve(trigger);
    };
  }, [isEnabled, hasNextPage, isFetchingNextPage]);

  return triggerRef;
}
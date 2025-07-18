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

  // Memoiza o callback para evitar recriações desnecessárias
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Cria o observer apenas uma vez
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0,
      rootMargin: "50px",
      root: rootElement,
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection, isEnabled, rootElement]);

  // Gerencia a observação do elemento trigger
  useEffect(() => {
    const observer = observerRef.current;
    const trigger = triggerRef.current;

    if (!observer || !trigger || !isEnabled || !hasNextPage || isFetchingNextPage) {
      return;
    }

    observer.observe(trigger);

    return () => {
      observer.unobserve(trigger);
    };
  }, [isEnabled, hasNextPage, isFetchingNextPage]);

  return triggerRef;
} 
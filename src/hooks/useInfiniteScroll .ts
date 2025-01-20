import { useRef, useCallback, useEffect } from 'react';

interface UseInfiniteScrollOptions {
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export function useInfiniteScroll({ loading, hasMore, onLoadMore }: UseInfiniteScrollOptions) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const cleanup = () => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
    };

    useEffect(() => {
        return cleanup;
    }, []);

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !node) return;
            
            if (observerRef.current) observerRef.current.disconnect();
            
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    onLoadMore();
                }
            });

            observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    return lastElementRef;
}
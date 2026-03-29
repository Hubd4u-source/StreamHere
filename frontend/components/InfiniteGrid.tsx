"use client";

import { useEffect, useState, useRef } from "react";
import NewAnimeCard from "./NewAnimeCard";
import { SeriesListItem } from "@/server/types";

interface InfiniteGridProps {
  initialItems: SeriesListItem[];
  fetchAction: (page: number) => Promise<SeriesListItem[]>;
  initialPage?: number;
}

export default function InfiniteGrid({ 
  initialItems, 
  fetchAction,
  initialPage = 1 
}: InfiniteGridProps) {
  const [items, setItems] = useState<SeriesListItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          await loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const newItems = await fetchAction(nextPage);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("InfiniteScroll Error:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {items.map((item, idx) => (
          <NewAnimeCard
            key={`${item.url}-${idx}`}
            url={item.url}
            title={item.title}
            image={item.image}
            postId={item.postId}
          />
        ))}
      </div>

      {hasMore && (
        <div 
          ref={loaderRef} 
          className="flex justify-center items-center py-12"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-content-tertiary font-bold tracking-widest text-xs uppercase animate-pulse">
                Fetching more stories...
              </p>
            </div>
          ) : (
            <div className="h-20" /> /* Spacer to trigger observer */
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-12 border-t border-border-subtle/30">
          <p className="text-content-tertiary font-bold tracking-widest text-sm uppercase">
            You've reached the end of the collection
          </p>
        </div>
      )}
    </div>
  );
}

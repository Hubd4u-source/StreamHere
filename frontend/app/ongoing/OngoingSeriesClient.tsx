"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewAnimeCard from "@/components/NewAnimeCard";
import { SeriesListItem } from "@/server/types";

interface OngoingSeriesClientProps {
  initialPage: number;
  initialQuery: string;
}

export default function OngoingSeriesClient({ initialPage, initialQuery }: OngoingSeriesClientProps) {
  const [items, setItems] = useState<SeriesListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [query, setQuery] = useState(initialQuery);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadOngoingSeries = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ongoing?page=${page}&q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data.items || []);
        setError(null);
      } catch (err) {
        console.error('Error loading ongoing series:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ongoing series');
      } finally {
        setLoading(false);
      }
    };

    loadOngoingSeries();
  }, [page, query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('q') as string;
    setQuery(searchQuery);
    setPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    router.push(`/ongoing?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // Update URL
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (newPage > 1) params.set('page', newPage.toString());
    router.push(`/ongoing?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full bg-bg-surface border border-border-subtle rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="section-heading text-xl text-red-500">Error Loading Series</h3>
        <p className="section-subtitle text-red-400/80">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-outline px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            name="q"
            placeholder="Search ongoing series..."
            defaultValue={query}
            className="w-full h-14 pl-14 pr-6 bg-bg-surface border border-border-subtle rounded-2xl text-content-primary placeholder-content-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-300"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-content-tertiary group-focus-within:text-accent transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 btn-primary px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-all duration-300"
          >
            Search
          </button>
        </form>
      </div>

      {query && (
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="section-subtitle">
            Search results for <span className="text-accent italic">"{query}"</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {items.map((item) => (
          <NewAnimeCard
            key={item.url}
            url={item.url}
            title={item.title}
            image={item.image}
            postId={item.postId}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 space-y-6">
          <div className="w-24 h-24 bg-bg-surface border border-border-subtle rounded-full flex items-center justify-center text-content-tertiary mx-auto">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M6 4h12M6 20h12M6 12h12M6 16h12" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="section-heading text-xl">No series found</p>
            <p className="section-subtitle">
              {query ? "We couldn't find any ongoing series matching your search." : "There are no ongoing series available right now."}
            </p>
          </div>
          {query && (
            <button 
              onClick={() => { setQuery(""); setPage(1); router.push('/ongoing'); }}
              className="btn-outline px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex justify-center items-center gap-6 pt-8">
          {page > 1 && (
            <button
              onClick={() => handlePageChange(page - 1)}
              className="btn-outline px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95"
            >
              Previous
            </button>
          )}
          <span className="text-content-tertiary font-bold tracking-widest text-sm uppercase">
            Page <span className="text-accent">{page}</span>
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="btn-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

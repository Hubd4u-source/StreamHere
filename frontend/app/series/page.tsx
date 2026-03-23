import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewAnimeCard from "@/components/NewAnimeCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default async function SeriesPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
  const page = Number(searchParams?.page || 1);
  const query = searchParams?.q || "";
  
  let data;
  let error = null;
  
  try {
    data = await fetchAnimeList(page);
  } catch (err) {
    console.error('Error fetching series:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }
  
  const items = data?.items || [];

  if (error) {
    return (
      <div className="min-h-screen bg-bg-base font-sans">
        <NewNavbar />
        <main className="w-full px-5 md:px-12 py-12 space-y-12 pb-24">
          <div className="text-center space-y-2">
            <h1 className="section-heading text-4xl">Series</h1>
            <p className="section-subtitle">Discover and watch your favorite anime series</p>
          </div>
          
          <div className="bg-bg-surface border border-border-subtle rounded-md p-8 text-center max-w-2xl mx-auto">
            <h3 className="section-heading text-xl mb-4">Error Loading Series</h3>
            <p className="text-content-secondary mb-6">{error}</p>
            <a href="/series" className="btn-primary inline-flex">Try Again</a>
          </div>
        </main>
        <NewBottomNav />
        <DesktopNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base font-sans">
      <NewNavbar />
      
      <main className="w-full px-5 md:px-12 py-12 space-y-16 pb-32">
        <div className="text-center space-y-3">
          <h1 className="section-heading text-4xl">Series</h1>
          <p className="section-subtitle">Discover and watch your favorite anime series</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-[520px] mx-auto">
          <form method="get" className="relative group/search">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content-tertiary group-focus-within/search:text-accent transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search series or titles..."
              defaultValue={query}
              className="w-full pl-12 pr-4 h-12 bg-bg-elevated border border-border-subtle rounded-md text-content-primary placeholder-content-tertiary focus:outline-none focus:border-accent-muted transition-colors"
            />
          </form>
        </div>

        {query && (
          <div className="text-center">
            <p className="text-content-tertiary">
              Results for <span className="text-accent font-medium">"{query}"</span>
            </p>
          </div>
        )}

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <NewAnimeCard
              key={item.url}
              url={item.url}
              title={item.title}
              image={item.image}
              postId={item.postId}
              genres={[]}
              year={2024}
              episodeCount={12}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-content-tertiary opacity-30">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
            </div>
            <p className="section-subtitle">
              {query ? "No series found for your search." : "No series available at the moment."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex justify-center items-center space-x-4 pt-8 border-t border-border-subtle/30">
            {page > 1 && (
              <a
                href={`/series?page=${page - 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                className="btn-outline"
              >
                Previous
              </a>
            )}
            <span className="text-content-tertiary text-sm font-medium">Page {page}</span>
            <a
              href={`/series?page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className="btn-primary"
            >
              Next
            </a>
          </div>
        )}
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}

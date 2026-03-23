import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewAnimeCard from "@/components/NewAnimeCard";

export default async function AnimePage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page || 1);
  const data = await fetchAnimeList(page);
  const items = data.items || [];

  return (
    <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
      <NewNavbar />
      
      <main className="w-full px-4 md:px-6 py-12 space-y-12 pb-32">
        <div className="space-y-4">
          <h1 className="section-heading text-4xl md:text-5xl">All Anime</h1>
          <p className="section-subtitle max-w-2xl text-lg">
            Discover and watch your favorite anime series from our extensive collection.
          </p>
        </div>

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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 pt-8">
          {page > 1 && (
            <a
              href={`/anime?page=${page - 1}`}
              className="btn-outline px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95"
            >
              Previous
            </a>
          )}
          <span className="text-content-tertiary font-bold tracking-widest text-sm uppercase">
            Page <span className="text-accent">{page}</span>
          </span>
          <a
            href={`/anime?page=${page + 1}`}
            className="btn-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
          >
            Next
          </a>
        </div>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}



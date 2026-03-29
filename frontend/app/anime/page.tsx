import { fetchAnimeList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewAnimeCard from "@/components/NewAnimeCard";
import InfiniteGrid from "@/components/InfiniteGrid";
import { getAnimeAction } from "../actions";

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

        <InfiniteGrid 
          initialItems={items} 
          fetchAction={getAnimeAction}
          initialPage={page}
        />
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}



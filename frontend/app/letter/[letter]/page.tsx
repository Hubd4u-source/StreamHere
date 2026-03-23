import { fetchLetterList } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewAnimeCard from "@/components/NewAnimeCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export async function generateMetadata({ params }: { params: { letter: string } }) {
  const displayLetter = params.letter === "0-9" ? "#" : params.letter.toUpperCase();
  return {
    title: `Anime starting with ${displayLetter} - AMAI TV`,
    description: `Browse anime series and movies starting with the letter ${displayLetter}.`,
  };
}

export default async function LetterPage({
  params,
  searchParams,
}: {
  params: { letter: string };
  searchParams: { page?: string };
}) {
  const displayLetter = params.letter === "0-9" ? "#" : params.letter.toUpperCase();
  const page = Number(searchParams?.page || 1);
  
  let data;
  let error = null;
  
  try {
    data = await fetchLetterList(displayLetter, page);
  } catch (err) {
    console.error(`Error fetching letter ${displayLetter}:`, err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }
  
  const items = data?.items || [];

  if (error) {
    return (
      <div className="min-h-screen bg-bg-base font-sans">
        <NewNavbar />
        <main className="w-full px-5 md:px-12 py-12 space-y-12 pb-24">
          <div className="text-center space-y-2">
            <h1 className="section-heading text-4xl">Letter {displayLetter}</h1>
            <p className="section-subtitle">Discover anime starting with {displayLetter}</p>
          </div>
          
          <div className="bg-bg-surface border border-border-subtle rounded-md p-8 text-center max-w-2xl mx-auto">
            <h3 className="section-heading text-xl mb-4">Error Loading Results</h3>
            <p className="text-content-secondary mb-6">{error}</p>
            <a href={`/letter/${params.letter}`} className="btn-primary inline-flex">Try Again</a>
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
          <h1 className="section-heading text-4xl">Anime starting with {displayLetter}</h1>
          <p className="section-subtitle">Explore our collection from A to Z</p>
        </div>

        {/* Letters Navigation Redux */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {["0-9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((l) => (
            <a
              key={l}
              href={`/letter/${l}`}
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border rounded-lg transition-all font-bold text-sm ${
                params.letter.toUpperCase() === l.toUpperCase()
                  ? "bg-accent/20 border-accent text-accent"
                  : "bg-bg-surface border-border-subtle text-content-primary hover:border-accent hover:text-accent"
              }`}
            >
              {l === "0-9" ? "#" : l}
            </a>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-10">
          {items.map((item) => (
            <NewAnimeCard
              key={item.url}
              url={item.url}
              title={item.title}
              image={item.image}
              postId={item.postId}
              genres={[]}
              year={2024}
              episodeCount={null}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-content-tertiary opacity-30">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
            </div>
            <p className="section-subtitle">
              No anime found starting with {displayLetter}.
            </p>
          </div>
        )}

        {/* Pagination mb-8 to clear bottom nav */}
        {items.length > 0 && (
          <div className="flex justify-center items-center space-x-4 pt-8 border-t border-border-subtle/30">
            {page > 1 && (
              <a
                href={`/letter/${params.letter}?page=${page - 1}`}
                className="btn-outline"
              >
                Previous
              </a>
            )}
            <span className="text-content-tertiary text-sm font-medium">Page {page}</span>
            <a
              href={`/letter/${params.letter}?page=${page + 1}`}
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

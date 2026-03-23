import { fetchNetworkContent, BASE } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewAnimeCard from "@/components/NewAnimeCard";
import { notFound } from "next/navigation";

interface NetworkPageProps {
  params: { slug: string };
  searchParams: { page?: string; q?: string };
}

const networkInfo = {
  "crunchyroll": {
    name: "Crunchyroll",
    image: `${BASE}/wp-content/uploads/crunchyroll-193x193.png`,
    description: "Premium anime streaming platform",
  },
  "disney": {
    name: "Disney+ Hotstar",
    image: `${BASE}/wp-content/uploads/hotstar-193x193.png`,
    description: "Disney, Marvel, and Star content",
  },
  "netflix": {
    name: "Netflix",
    image: `${BASE}/wp-content/uploads/netflix-193x193.png`,
    description: "Global streaming entertainment",
  },
  "prime-video": {
    name: "Prime Video",
    image: `${BASE}/wp-content/uploads/primevideo-193x193.png`,
    description: "Amazon's streaming service",
  },
  "cartoon-network": {
    name: "Cartoon Network",
    image: `${BASE}/wp-content/uploads/cartoonnetwork-193x193.png`,
    description: "Kids and family entertainment",
  },
  "sony-yay": {
    name: "Sony Yay",
    image: `${BASE}/wp-content/uploads/sonyay-193x193.png`,
    description: "Sony's kids entertainment channel",
  },
  "hungama-tv": {
    name: "Hungama TV",
    image: `${BASE}/wp-content/uploads/hungama-193x193.png`,
    description: "Indian kids entertainment",
  },
  "disney-channel": {
    name: "Disney Channel",
    image: `${BASE}/wp-content/uploads/disney-193x193.png`,
    description: "Classic Disney channel content",
  }
};

export default async function NetworkPage({ params, searchParams }: NetworkPageProps) {
  const { slug } = params;
  const page = Number(searchParams?.page || 1);
  const query = searchParams?.q || "";

  // Check if network exists
  if (!networkInfo[slug as keyof typeof networkInfo]) {
    notFound();
  }

  const network = networkInfo[slug as keyof typeof networkInfo];

  let data;
  let error = null;

  try {
    data = await fetchNetworkContent(slug, page, query);
  } catch (err) {
    console.error(`Error fetching ${network.name} content:`, err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  const items = data?.items || [];

  if (error) {
    return (
      <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
        <NewNavbar />
        <main className="w-full px-4 md:px-6 py-12 space-y-12 pb-32">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center p-4">
              <img
                src={network.image}
                alt={network.name}
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="space-y-2">
              <h1 className="section-heading text-4xl md:text-5xl font-serif">{network.name}</h1>
              <p className="section-subtitle max-w-2xl text-lg">{network.description}</p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="section-heading text-xl text-red-500">Error Loading Content</h3>
            <p className="section-subtitle text-red-400/80">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-outline px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Try Again
            </button>
          </div>
        </main>
        <NewBottomNav />
        <DesktopNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
      <NewNavbar />

      <main className="w-full px-4 md:px-6 py-12 space-y-12 pb-32">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center p-4 shadow-2xl shadow-accent/5">
            <img
              src={network.image}
              alt={network.name}
              className="w-14 h-14 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="section-heading text-4xl md:text-5xl font-serif">{network.name}</h1>
            <p className="section-subtitle max-w-2xl text-lg">{network.description}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <form method="get" className="relative group">
            <input
              type="text"
              name="q"
              placeholder={`Search ${network.name} content...`}
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
              <p className="section-heading text-xl">No content found</p>
              <p className="section-subtitle">
                {query ? `We couldn't find any ${network.name} content matching your search.` : `There is no ${network.name} content available right now.`}
              </p>
            </div>
            {query && (
              <a 
                href={`/networks/${slug}`}
                className="btn-outline px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm inline-block"
              >
                Clear Search
              </a>
            )}
          </div>
        )}

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex justify-center items-center gap-6 pt-8">
            {page > 1 && (
              <a
                href={`/networks/${slug}?page=${page - 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                className="btn-outline px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95"
              >
                Previous
              </a>
            )}
            <span className="text-content-tertiary font-bold tracking-widest text-sm uppercase">
              Page <span className="text-accent">{page}</span>
            </span>
            <a
              href={`/networks/${slug}?page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className="btn-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
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

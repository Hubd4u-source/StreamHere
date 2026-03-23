import { fetchAnimeList, fetchMoviesList, fetchCartoonList, BASE } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewCarousel from "@/components/NewCarousel";
import NewAnimeCard from "@/components/NewAnimeCard";
import OngoingSeriesGrid from "@/components/OngoingSeriesGrid";
import UpcomingEpisodesGrid from "@/components/UpcomingEpisodesGrid";
import ContinueWatchingHome from "@/components/ContinueWatchingHome";

export default async function HomePage() {
  // Fetch trending anime
  const trendingData = await fetchAnimeList(1);
  const trendingAnime = trendingData.items?.slice(0, 10) || [];

  // Fetch latest episodes
  const latestData = await fetchAnimeList(2);
  const latestAnime = latestData.items?.slice(0, 10) || [];

  // Fetch popular anime
  const popularData = await fetchAnimeList(3);
  const popularAnime = popularData.items?.slice(0, 10) || [];

  // Fetch top movies
  const moviesData = await fetchMoviesList(1);
  const moviesList = moviesData.items?.slice(0, 10) || [];

  // Fetch popular cartoons
  const cartoonsData = await fetchCartoonList(1);
  const cartoonsList = cartoonsData.items?.slice(0, 10) || [];

  // Franchise logos (used in carousel)
  const FRANCHISE_BASE = (process.env.NEXT_PUBLIC_FRANCHISE_BASE || 'https://rareanimes.app').replace(/\/+$/, '');

  const franchises = [
    { name: 'Iron Man', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Ironman.png` },
    { name: 'Slugterra', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Slugterra.png` },
    { name: 'Miraculous', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Miraclous.png` },
    { name: 'Transformers', img: `${FRANCHISE_BASE}/wp-content/uploads/2025/04/Transformers.png` },
    { name: 'Naruto', img: `${FRANCHISE_BASE}/wp-content/uploads/2025/04/Naruto.png` },
    { name: 'Spider Man', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Spiderman.png` },
    { name: 'Pokemon', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Pokemon.png` },
    { name: 'Shin Chan', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Shinchan.png` },
    { name: 'Doraemon', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Doraemon.png` },
    { name: 'Beyblade', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Beyblade.png` },
    { name: 'Ben 10', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Ben-10.png` },
    { name: 'Dragon Ball', img: `${FRANCHISE_BASE}/wp-content/uploads/2021/08/Dragonball.png` },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
      <NewNavbar />

      <main className="w-full px-4 md:px-8 pb-32 space-y-24 pt-8">
        {/* Continue Watching */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ContinueWatchingHome />
        </div>

        {/* Franchises */}
        <section>
          <NewCarousel title="Franchises" subtitle="Tap a logo to discover the full collection" autoplay loop autoplayIntervalMs={3000}>
            {[...franchises, ...franchises].map(({ name, img }, idx) => (
              <a
                key={`${name}-${idx}`}
                href={`/search?q=${encodeURIComponent(name)}`}
                className="group flex-shrink-0 w-48 h-[240px] bg-bg-surface border border-border-subtle rounded-[32px] p-6 transition-all duration-500 hover:border-accent/40 hover:bg-bg-elevated hover:shadow-2xl hover:shadow-accent/5"
                title={`Search ${name}`}
              >
                <div className="h-[140px] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
                  <img
                    src={`/api/image?src=${encodeURIComponent(img)}`}
                    alt={name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                  />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent leading-tight">{name}</div>
                  <div className="text-[14px] font-serif text-content-secondary leading-tight truncate">{name} Collection</div>
                </div>
              </a>
            ))}
          </NewCarousel>
        </section>

        {/* Networks Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="section-heading text-3xl md:text-4xl">Networks</h2>
              <p className="section-subtitle text-lg">Watch content from your favorite platforms</p>
            </div>
            <a href="/networks" className="btn-outline px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-accent/20 transition-all">
              View All
            </a>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { id: 'crunchyroll', name: 'Crunchyroll', img: "/wp-content/uploads/crunchyroll-193x193.png" },
              { id: 'disney', name: 'Disney+', img: "/wp-content/uploads/hotstar-193x193.png" },
              { id: 'netflix', name: 'Netflix', img: "/wp-content/uploads/netflix-193x193.png" },
              { id: 'prime-video', name: 'Prime', img: "/wp-content/uploads/primevideo-193x193.png" },
              { id: 'cartoon-network', name: 'CN', img: "/wp-content/uploads/cartoonnetwork-193x193.png" },
              { id: 'sony-yay', name: 'Sony Yay', img: "/wp-content/uploads/sonyay-193x193.png" },
              { id: 'hungama-tv', name: 'Hungama', img: "/wp-content/uploads/hungama-193x193.png" },
              { id: 'disney-channel', name: 'Disney CH', img: "/wp-content/uploads/disney-193x193.png" },
            ].map((net) => (
              <a 
                key={net.id}
                href={`/networks/${net.id}`} 
                className="group flex flex-col items-center gap-3 transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-bg-surface border border-border-subtle rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-bg-elevated group-hover:border-accent/30 group-hover:shadow-xl group-hover:shadow-accent/5">
                  <img
                    src={`/api/image?src=${encodeURIComponent(BASE + net.img)}`}
                    alt={net.name}
                    className="max-w-[50%] max-h-[50%] object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-content-tertiary group-hover:text-accent transition-colors">
                  {net.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Ongoing Series Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="section-heading text-3xl md:text-4xl">Ongoing Series</h2>
              <p className="section-subtitle text-lg">Currently airing series and new shows</p>
            </div>
            <a href="/ongoing" className="btn-outline px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-accent/20 transition-all">
              View All
            </a>
          </div>

          <OngoingSeriesGrid />
        </section>

        {/* Upcoming Episodes Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="section-heading text-3xl md:text-4xl">Upcoming Episodes</h2>
              <p className="section-subtitle text-lg">Coming soon with real-time countdowns</p>
            </div>
            <a href="/upcoming" className="btn-outline px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-accent/20 transition-all">
              Schedule
            </a>
          </div>

          <UpcomingEpisodesGrid />
        </section>

        {/* Trending Now */}
        <section>
          <NewCarousel title="Trending Now" subtitle="The most watched titles this week">
            {trendingAnime.map((anime, index) => (
              <div key={anime.url} className="flex-shrink-0 w-40 md:w-52 pr-6">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  rating={Math.floor(Math.random() * 2) + 4}
                  year={2024}
                  episodeCount={24}
                  isPopular={index < 3}
                />
              </div>
            ))}
          </NewCarousel>
        </section>

        {/* Latest Episodes */}
        <section>
          <NewCarousel title="Latest Episodes" subtitle="Recently added content" showViewAll viewAllHref="/anime">
            {latestAnime.map((anime, index) => (
              <div key={anime.url} className="flex-shrink-0 w-40 md:w-52 pr-6">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  rating={Math.floor(Math.random() * 2) + 3}
                  year={2024}
                  episodeCount={12}
                  isNew={index < 5}
                />
              </div>
            ))}
          </NewCarousel>
        </section>

        {/* Popular Series */}
        <section>
          <NewCarousel title="Popular Series" subtitle="Fan favorites and essential classics" showViewAll viewAllHref="/anime">
            {popularAnime.map((anime) => (
              <div key={anime.url} className="flex-shrink-0 w-40 md:w-52 pr-6">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  rating={Math.floor(Math.random() * 2) + 4}
                  year={2023}
                  episodeCount={24}
                  isPopular={true}
                />
              </div>
            ))}
          </NewCarousel>
        </section>

        {/* Top Movies */}
        {moviesList.length > 0 && (
          <section>
            <NewCarousel title="Top Movies" subtitle="Cinematic masterpieces and latest hits" showViewAll viewAllHref="/movies">
              {moviesList.map((anime, index) => (
                <div key={anime.url} className="flex-shrink-0 w-40 md:w-52 pr-6">
                  <NewAnimeCard
                    url={anime.url}
                    title={anime.title}
                    image={anime.image}
                    postId={anime.postId}
                    rating={Math.floor(Math.random() * 2) + 4}
                    year={2024}
                    episodeCount={1}
                    isPopular={index < 3}
                  />
                </div>
              ))}
            </NewCarousel>
          </section>
        )}

        {/* Popular Cartoons */}
        {cartoonsList.length > 0 && (
          <section>
            <NewCarousel title="Popular Cartoons" subtitle="Animated adventures for everyone" showViewAll viewAllHref="/cartoon">
              {cartoonsList.map((anime, index) => (
                <div key={anime.url} className="flex-shrink-0 w-40 md:w-52 pr-6">
                  <NewAnimeCard
                    url={anime.url}
                    title={anime.title}
                    image={anime.image}
                    postId={anime.postId}
                    rating={Math.floor(Math.random() * 2) + 3}
                    year={2024}
                    isNew={index < 4}
                  />
                </div>
              ))}
            </NewCarousel>
          </section>
        )}

        {/* Navigate A to Z Section */}
        <section className="pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="section-heading text-3xl md:text-4xl">Navigate A to Z</h2>
              <p className="section-subtitle text-lg">Find anime by its starting letter</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3 lg:gap-4">
            {["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
              <a
                key={letter}
                href={`/letter/${letter === "#" ? "0-9" : letter}`}
                className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-bg-surface border border-border-subtle rounded-xl sm:rounded-2xl hover:border-accent hover:bg-accent/10 hover:text-accent hover:scale-105 transition-all duration-300 font-bold text-sm sm:text-base lg:text-lg text-content-primary shadow-sm hover:shadow-accent/20"
              >
                {letter}
              </a>
            ))}
          </div>
        </section>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}



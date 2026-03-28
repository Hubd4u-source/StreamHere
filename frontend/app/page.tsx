import { fetchAnimeList, fetchMoviesList, fetchCartoonList, fetchFreshDrops, BASE } from "@/server/scraper";
import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import NewCarousel from "@/components/NewCarousel";
import NewAnimeCard from "@/components/NewAnimeCard";
import OngoingSeriesGrid from "@/components/OngoingSeriesGrid";
import UpcomingEpisodesGrid from "@/components/UpcomingEpisodesGrid";
import ContinueWatchingHome from "@/components/ContinueWatchingHome";
import RecentlyWatchedHome from "@/components/RecentlyWatchedHome";
import HeroBanner from "@/components/HeroBanner";
import BroadcastHistory from "@/components/BroadcastHistory";
import { getFeaturedAnime } from "@/server/featured";
import { settingsService } from "@/lib/settingsService";

export default async function HomePage() {
  // Fetch featured items for hero
  const featuredItems = await getFeaturedAnime();

  // Fetch dynamic settings
  const settings = await settingsService.getSettings();

  // Fetch trending anime
  const trendingData = await fetchAnimeList(1);
  const trendingAnime = trendingData.items?.slice(0, 10) || [];

  // Fetch latest episodes (fallback)
  const latestData = await fetchAnimeList(2);

  // Fetch fresh drops
  const freshDrops = await fetchFreshDrops();
  const latestAnime = freshDrops.length > 0 ? freshDrops : (latestData.items?.slice(0, 10) || []);

  // Fetch popular anime
  const popularData = await fetchAnimeList(3);
  const popularAnime = popularData.items?.slice(0, 10) || [];

  // Fetch top movies
  const moviesData = await fetchMoviesList(1);
  const moviesList = moviesData.items?.slice(0, 10) || [];

  // Fetch popular cartoons
  const cartoonsData = await fetchCartoonList(1);
  const cartoonsList = cartoonsData.items?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
      <NewNavbar />

      <main className="w-full pb-32 space-y-24">
        {/* Hero Banner Section */}
        <HeroBanner initialItems={featuredItems} />

        {/* Global Broadcast History */}
        <BroadcastHistory />

        <div className="px-4 md:px-8 space-y-24">
          {/* Continue Watching */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ContinueWatchingHome />
          </div>

          {/* Recently Watched */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RecentlyWatchedHome />
          </div>
        </div>



        {/* Ongoing Series Section */}
        <section>
          <NewCarousel 
            title="Ongoing Series" 
            subtitle="Currently airing series and new shows" 
            showViewAll 
            viewAllHref="/ongoing"
          >
            <OngoingSeriesGrid />
          </NewCarousel>
        </section>

        {/* Upcoming Episodes Section */}
        {!settings.hide_upcoming && (
          <section>
            <NewCarousel 
              title="Upcoming Episodes" 
              subtitle="Coming soon with real-time countdowns" 
              showViewAll 
              viewAllHref="/upcoming"
            >
              <UpcomingEpisodesGrid />
            </NewCarousel>
          </section>
        )}

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
            {latestAnime.map((anime: any, index: number) => (
              <div key={anime.url} className="flex-shrink-0 w-40 md:w-52 pr-6">
                <NewAnimeCard
                  url={anime.url}
                  title={anime.title}
                  image={anime.image}
                  postId={anime.postId}
                  rating={Math.floor(Math.random() * 2) + 3}
                  year={2024}
                  season={anime.season}
                  episodeRange={anime.episodeRange}
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
        {/* Legal Notice Section */}
        <section className="border-t border-border-subtle/30 pt-16 pb-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Legal Notice</span>
             </div>
             <h3 className="text-xl md:text-2xl font-bold text-white">Disclaimer of Liability</h3>
             <p className="text-content-secondary text-sm md:text-base leading-relaxed italic">
               &quot;Amai Tv India does not store any files on its own server. We only index links from the internet which are hosted on third-party services. We index links just like Google. We are not responsible for any activities conducted on this site or external platforms.&quot;
             </p>
             <div className="pt-4">
                <a href="/dmca" className="text-accent hover:underline text-xs font-medium uppercase tracking-widest">Read Full DMCA Policy</a>
             </div>
          </div>
        </section>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}



import type { Metadata } from "next";
import Link from "next/link";
import { fetchAnimeList, fetchMoviesList, fetchCartoonList } from "@/server/scraper";
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
import LatestEpisodesShelf from "@/components/LatestEpisodesShelf";
import CommunityFeedbackSection from "@/components/CommunityFeedbackSection";
import { getFeaturedAnime } from "@/server/featured";
import { settingsService } from "@/lib/settingsService";
import { getLatestEpisodesFeed } from "@/lib/homeFeed";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Watch Anime Online Free - Hindi Dubbed, English Subbed | AMAI TV",
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/") },
};

const browseLinks = [
  { name: "Anime", href: "/anime", description: "Browse all anime titles" },
  { name: "Series", href: "/series", description: "Explore full series libraries" },
  { name: "Movies", href: "/movies", description: "Find anime movies and specials" },
  { name: "Cartoons", href: "/cartoon", description: "Watch animated shows and family titles" },
  { name: "Ongoing", href: "/ongoing", description: "Track currently airing episodes" },
  { name: "Upcoming", href: "/upcoming", description: "See what releases next" },
  { name: "Genres", href: "/genres", description: "Jump into action, romance, fantasy, and more" },
  { name: "Schedule", href: "/schedule", description: "Follow daily release timing" },
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${absoluteUrl("/")}#website`,
  name: SITE_NAME,
  alternateName: "AmaiTV",
  url: absoluteUrl("/"),
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${SITE_NAME} Browse Hub`,
  url: absoluteUrl("/"),
  description: "Browse anime, series, movies, cartoons, schedules, and genre collections on AMAI TV.",
  isPartOf: { "@id": `${absoluteUrl("/")}#website` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: browseLinks.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.name,
      url: absoluteUrl(link.href),
    })),
  },
};

export default async function HomePage() {
  const featuredItems = await getFeaturedAnime();
  const settings = await settingsService.getSettings();
  const trendingData = await fetchAnimeList(1);
  const trendingAnime = trendingData.items?.slice(0, 10) || [];
  const latestAnime = await getLatestEpisodesFeed(12);
  const popularData = await fetchAnimeList(3);
  const popularAnime = popularData.items?.slice(0, 10) || [];
  const moviesData = await fetchMoviesList(1);
  const moviesList = moviesData.items?.slice(0, 10) || [];
  const cartoonsData = await fetchCartoonList(1);
  const cartoonsList = cartoonsData.items?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <NewNavbar />

      <main className="w-full pb-32 space-y-24">
        <HeroBanner initialItems={featuredItems} />

        <section className="px-4 md:px-8">
          <div className="mx-auto max-w-6xl border border-border-subtle bg-bg-surface/80">
            <div className="border-b border-border-subtle px-4 py-4 sm:px-6">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">Browse AMAI TV</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <h1 className="section-heading text-3xl md:text-4xl">
                    Watch anime, movies, cartoons, and latest episodes
                  </h1>
                  <p className="max-w-3xl text-sm text-content-secondary md:text-base">
                    Strong category pages help mobile users browse faster and give search engines clearer paths into the AMAI TV library.
                  </p>
                </div>
                <Link
                  href="/search"
                  className="inline-flex h-11 items-center justify-center border border-accent/40 px-5 text-[11px] font-bold uppercase tracking-[0.28em] text-accent transition-colors hover:bg-accent/10"
                >
                  Search Titles
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {browseLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "group flex min-h-[122px] flex-col justify-between px-4 py-4 transition-colors hover:bg-bg-elevated",
                    "border-border-subtle",
                    index < browseLinks.length - 2 ? "border-b" : "",
                    index % 2 === 0 ? "border-r sm:border-r" : "",
                    index < 4 ? "sm:border-b" : "",
                    index % 4 !== 3 ? "sm:border-r" : "",
                  ].join(" ")}
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-accent/80">Section</p>
                    <h2 className="text-lg font-bold text-content-primary transition-colors group-hover:text-accent">
                      {link.name}
                    </h2>
                    <p className="text-xs leading-5 text-content-secondary sm:text-[13px]">
                      {link.description}
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.26em] text-content-tertiary group-hover:text-accent">
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <BroadcastHistory />

        <div className="px-4 md:px-8 space-y-24">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ContinueWatchingHome />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RecentlyWatchedHome />
          </div>
        </div>

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

        <section>
          <LatestEpisodesShelf initialItems={latestAnime} />
        </section>

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

        <CommunityFeedbackSection />

        <section className="pb-16">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-bg-surface text-sm font-bold text-content-primary shadow-sm transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-accent/20 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-base lg:h-14 lg:w-14 lg:text-lg"
              >
                {letter}
              </a>
            ))}
          </div>
        </section>

        <section className="border-t border-border-subtle/30 pt-16 pb-8">
          <div className="mx-auto max-w-4xl space-y-6 px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Legal Notice</span>
            </div>
            <h3 className="text-xl font-bold text-white md:text-2xl">Disclaimer of Liability</h3>
            <p className="text-sm italic leading-relaxed text-content-secondary md:text-base">
              &quot;Amai Tv India does not store any files on its own server. We only index links from the internet which are hosted on third-party services. We index links just like Google. We are not responsible for any activities conducted on this site or external platforms.&quot;
            </p>
            <div className="pt-4">
              <a href="/dmca" className="text-xs font-medium uppercase tracking-widest text-accent hover:underline">
                Read Full DMCA Policy
              </a>
            </div>
          </div>
        </section>
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}

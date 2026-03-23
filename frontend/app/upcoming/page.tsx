import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import UpcomingEpisodesClient from "./UpcomingEpisodesClient";

export default function UpcomingPage() {
  return (
    <div className="min-h-screen bg-bg-base text-content-primary font-sans selection:bg-accent/30 selection:text-accent">
      <NewNavbar />
      
      <main className="w-full px-4 md:px-6 py-12 space-y-12 pb-32">
        <div className="space-y-4">
          <h1 className="section-heading text-4xl md:text-5xl font-serif">Upcoming Episodes</h1>
          <p className="section-subtitle max-w-2xl text-lg">
            New episodes coming soon. Stay ahead of the curve with real-time countdown timers.
          </p>
        </div>

        <UpcomingEpisodesClient />
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}

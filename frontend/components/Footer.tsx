import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-auto relative bg-bg-base border-t border-border-subtle z-40 overflow-hidden">
      {/* Accent glow line matching Cinematic Obsidian theme */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      
      {/* Ambient background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-20 bg-accent/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="py-10 text-center relative z-10 px-4 space-y-4">
        <p className="text-content-secondary text-[13px] font-medium tracking-wide">
          &copy; <span className="text-accent font-bold">2026</span> AMAI TV India. All Rights Reserved.
        </p>
        <div className="flex items-center justify-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] text-content-tertiary">
          <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          <Link href="/dmca" className="hover:text-accent transition-colors">DMCA</Link>
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-[10px] text-content-tertiary uppercase tracking-[0.2em] font-bold opacity-60">Legal Disclaimer</p>
          <p className="text-[11px] text-content-tertiary leading-relaxed">
            AMAI TV India does not store any files on its own server. We only index links from the internet which are hosted on third-party services. We index links just like Google.
          </p>
          <p className="text-[10px] text-content-tertiary/50">
            We are not responsible for any activities conducted on third-party sites.
          </p>
        </div>
      </div>
      
      {/* Extra padding to prevent being hidden behind fixed bottom navigation bars (mobile & desktop) */}
      <div className="h-24 md:h-20"></div>
    </footer>
  );
}

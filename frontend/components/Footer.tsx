export default function Footer() {
  return (
    <footer className="w-full mt-auto relative bg-bg-base border-t border-border-subtle z-40 overflow-hidden">
      {/* Accent glow line matching Cinematic Obsidian theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      
      {/* Ambient background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-20 bg-accent/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="py-10 text-center relative z-10">
        <p className="text-content-secondary text-[13px] font-medium tracking-wide">
          &copy; <span className="text-accent font-bold">2026</span> AMAI TV India. All Rights Reserved.
        </p>
      </div>
      
      {/* Extra padding to prevent being hidden behind fixed bottom navigation bars (mobile & desktop) */}
      <div className="h-24 md:h-20"></div>
    </footer>
  );
}

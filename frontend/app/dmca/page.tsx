import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA - AMAI TV",
  description: "Digital Millennium Copyright Act (DMCA) Policy for AMAI TV",
};

export default function DMCAPage() {
  return (
    <main className="w-full px-4 sm:px-6 md:px-10 lg:px-12 py-12 md:py-24 space-y-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-accent tracking-wide">DMCA takedown requirements</h1>
          <p className="text-content-secondary leading-relaxed">
            We take the intellectual property rights of others seriously and require that our Users do the same.
          </p>
        </header>

        <section className="bg-bg-surface border border-border-subtle p-6 md:p-10 rounded-3xl space-y-8">
          <p className="text-content-primary leading-relaxed">
            The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. If you own a copyright or have authority to act on behalf of a copyright owner and want to report a claim that a third party is infringing that material on or through GitLab's services, please submit a DMCA report on our Contact page, and we will take appropriate action.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">DMCA Report requirements</h2>
            <ul className="list-disc list-inside space-y-4 text-content-secondary leading-relaxed marker:text-accent">
              <li>A description of the copyrighted work that you claim is being infringed;</li>
              <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled and the URL or other location of that material;</li>
              <li>Your name, title (if acting as an agent), address, telephone number, and email address;</li>
              <li>The following statement: "I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)";</li>
              <li>The following statement: "The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed";</li>
              <li>An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf.</li>
            </ul>
          </div>

          <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl space-y-3">
            <p className="text-content-primary">
              Your DMCA take down request should be submit here: <a href="/contact" className="text-accent hover:underline font-medium">Contact Us</a>
            </p>
            <p className="text-content-secondary text-sm">
              We will then review your DMCA request and take proper actions, including removal of the content from the website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

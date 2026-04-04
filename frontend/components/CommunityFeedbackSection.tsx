"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db, isFirebaseConfigured } from "@/lib/firebase";

type FeedbackType = "feedback" | "bug" | "idea";

type FeedbackItem = {
  id: string;
  message: string;
  type: FeedbackType;
  userName: string;
  createdAtMs: number;
};

const FEEDBACK_LIMIT = 8;

function getFeedbackTypeLabel(type: FeedbackType) {
  switch (type) {
    case "bug":
      return "Bug Report";
    case "idea":
      return "Feature Idea";
    default:
      return "Community Feedback";
  }
}

export default function CommunityFeedbackSection() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [type, setType] = useState<FeedbackType>("feedback");
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const feedbackQuery = query(
      collection(db, "communityFeedback"),
      orderBy("createdAtMs", "desc"),
      limit(FEEDBACK_LIMIT)
    );

    const unsubscribe = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        const nextItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FeedbackItem, "id">),
        }));
        setItems(nextItems);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to subscribe to community feedback:", snapshotError);
        setError("Community feedback is temporarily unavailable.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError("Sign in first to post feedback for the AMAI community.");
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError("Write a short message before posting.");
      return;
    }

    if (!isFirebaseConfigured) {
      setError("Firebase is not configured, so feedback cannot be posted right now.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      await addDoc(collection(db, "communityFeedback"), {
        uid: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "AMAI User",
        userEmail: user.email || null,
        message: trimmedMessage,
        type,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      });

      setMessage("");
      setType("feedback");
      setSuccess("Feedback posted. Thanks for helping improve AMAI TV.");
    } catch (submitError) {
      console.error("Failed to post feedback:", submitError);
      setError("Could not post feedback right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="community-feedback" className="px-4 md:px-8 scroll-mt-24 md:scroll-mt-28">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border-subtle bg-[radial-gradient(circle_at_top_left,_rgba(232,201,122,0.14),_transparent_33%),linear-gradient(180deg,rgba(18,18,22,0.99),rgba(10,10,14,0.98))] p-4 shadow-2xl md:rounded-[2.25rem] md:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px] md:[background-size:32px_32px]" />

        <div className="relative grid gap-5 lg:gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4 md:space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                  Community Hub
                </span>
              </div>
              <h2 className="section-heading text-2xl leading-tight md:text-4xl">
                Talk to the developer and shape the site
              </h2>
              <p className="section-subtitle max-w-xl text-sm leading-relaxed md:text-lg">
                Share ideas, bug reports, or feature requests. On mobile, this section stays compact and easy to read so people can reach out fast.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="https://instagram.com/exe_faizan"
                target="_blank"
                rel="noreferrer"
                className="group rounded-[1.25rem] border border-border-subtle bg-bg-surface/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-bg-surface md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-accent">
                      Talk To Developer
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">
                      @exe_faizan
                    </h3>
                  </div>
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    DM
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-content-tertiary">
                  Direct feedback, bug reports, collabs, or ideas for AMAI TV.
                </p>
              </a>

              <div className="rounded-[1.25rem] border border-border-subtle bg-bg-surface/70 p-4 md:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-accent">
                  Community Feedback
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">
                  Live feature board
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-content-tertiary">
                  Signed-in users can post feedback here so everyone can see what the community wants next.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-[1.25rem] border border-border-subtle bg-bg-surface/55 p-4 md:space-y-5 md:p-5"
            >
              <div className="grid gap-4 sm:grid-cols-[170px_minmax(0,1fr)]">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-content-tertiary">
                    Post Type
                  </label>
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value as FeedbackType)}
                    className="h-11 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-content-primary outline-none transition-colors focus:border-accent/50"
                  >
                    <option value="feedback">Feedback</option>
                    <option value="idea">Feature Idea</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-content-tertiary">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    maxLength={280}
                    placeholder="Tell the community what should improve, what feels broken, or what feature you want next."
                    className="min-h-[120px] w-full resize-none rounded-xl border border-border-subtle bg-bg-base px-4 py-3 text-sm leading-relaxed text-content-primary placeholder:text-content-tertiary/60 outline-none transition-colors focus:border-accent/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-border-subtle/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-content-tertiary">
                  {user ? (
                    <span>
                      Posting as{" "}
                      <span className="font-semibold text-content-primary">
                        {user.displayName || user.email?.split("@")[0] || "AMAI User"}
                      </span>
                    </span>
                  ) : (
                    <span>
                      <Link href="/signin" className="font-semibold text-accent hover:underline">
                        Sign in
                      </Link>{" "}
                      to post feedback to the public board.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !isFirebaseConfigured}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-xs font-black uppercase tracking-[0.24em] text-bg-base transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Feedback"}
                </button>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-green-400">{success}</p>}
              {!isFirebaseConfigured && (
                <p className="text-sm text-content-tertiary">
                  Feedback posting appears disabled because Firebase is not configured for this environment.
                </p>
              )}
            </form>
          </div>

          <div className="rounded-[1.25rem] border border-border-subtle bg-bg-surface/55 p-4 md:p-5">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-accent">
                  Latest Community Posts
                </p>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  What users are saying
                </h3>
              </div>
              <div className="shrink-0 rounded-full border border-border-subtle bg-bg-base px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-content-tertiary">
                {items.length} posts
              </div>
            </div>

            <div className="space-y-3">
              {loading && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse rounded-2xl border border-border-subtle bg-bg-base/70 p-4">
                      <div className="h-3 w-24 rounded bg-bg-surface" />
                      <div className="mt-3 h-3 w-full rounded bg-bg-surface" />
                      <div className="mt-2 h-3 w-3/4 rounded bg-bg-surface" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-base/50 p-6 text-center">
                  <p className="text-sm text-content-secondary">
                    No community feedback yet. Be the first one to post an idea for AMAI TV.
                  </p>
                </div>
              )}

              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border-subtle bg-bg-base/70 p-4 transition-colors duration-300 hover:border-accent/30"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                      {getFeedbackTypeLabel(item.type)}
                    </span>
                    <span className="text-xs font-semibold text-content-primary">
                      {item.userName}
                    </span>
                    <span className="text-xs text-content-tertiary">
                      {new Date(item.createdAtMs).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-content-secondary">
                    {item.message}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

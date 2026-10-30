import Link from "next/link";
import { ArrowDown, ArrowRight, Leaf, Sprout, Sparkles } from "lucide-react";
import CommentForm from "@/components/CommentForm";
import CommentWall from "@/components/CommentWall";

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand no-underline text-inherit">
          <span className="brand-mark">IITA</span>
          <span>
            IITA <span className="text-green-800">@60</span>
            <small>Six decades of impact</small>
          </span>
        </Link>
        <a className="nav-link" href="#messages">Community messages ↗</a>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={14} /> 60 years of growing impact</span>
          <h1>Rooted in Africa.<br /><span>Growing the future.</span></h1>
          <p>
            Six decades of science, partnerships, and innovation. Celebrate IITA’s journey
            by sharing a message with the people who have helped shape its story.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#share">Leave a message <ArrowRight size={17} /></a>
            <a className="btn-outline" href="#messages">Read community messages <ArrowDown size={16} /></a>
          </div>
          <div className="stats-row">
            <div className="stat"><strong>60 years</strong><span>Of research and innovation</span></div>
            <div className="stat"><strong>One mission</strong><span>A food-secure Africa</span></div>
            <div className="stat"><strong>Shared future</strong><span>Powered by collaboration</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="share">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <div className="kicker">Your voice belongs here</div>
              <h2>Be part of the story.</h2>
              <p>Share a memory, celebrate a milestone, or send your wishes to the IITA community.</p>
            </div>
          </div>
          <div className="content-grid">
            <div className="panel panel-pad">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-50 text-green-800"><Leaf size={22} /></span>
                <div>
                  <h3>Write your message</h3>
                  <p className="m-0 text-sm text-gray-500">Every voice adds to our shared history.</p>
                </div>
              </div>
              <CommentForm />
            </div>
            <aside className="panel panel-pad">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-green-900" style={{ background: "#edf5df" }}>
                <Sprout size={25} />
              </div>
              <h3 className="mt-5">Six decades of growing together</h3>
              <p className="panel-subtitle">
                IITA’s story is shaped by researchers, farmers, alumni, partners, and communities
                working toward a more food-secure Africa.
              </p>
              <div className="space-y-4 border-t border-gray-100 pt-5">
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-700" />
                  <div><strong className="text-sm">Celebrate the journey</strong><p className="mt-1 text-sm leading-6 text-gray-500">Share the people and moments that made a difference.</p></div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-700" />
                  <div><strong className="text-sm">Look to the future</strong><p className="mt-1 text-sm leading-6 text-gray-500">Send your hopes for the next chapter of agricultural innovation.</p></div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-700" />
                  <div><strong className="text-sm">Keep it constructive</strong><p className="mt-1 text-sm leading-6 text-gray-500">Messages are moderated to keep the wall respectful and useful.</p></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section pt-0" id="messages">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <div className="kicker">The community wall</div>
              <h2>Messages that move us.</h2>
              <p>Read approved messages from people celebrating IITA @60. More messages appear as you load them.</p>
            </div>
          </div>
          <CommentWall />
        </div>
      </section>

      <footer className="site-footer">
        <span>© IITA @60 · Celebrating six decades of impact</span>
        <span>Science · Partnerships · A food-secure Africa</span>
      </footer>
    </main>
  );
}

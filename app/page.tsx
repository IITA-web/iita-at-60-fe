"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import CommentForm from "@/components/CommentForm";
import CommentWall from "@/components/CommentWall";

export default function HomePage() {
  const [formOpen, setFormOpen] = useState(false);

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
          <div className="header-actions">
            <a className="nav-link" href="#messages">Community messages ↗</a>
            <button className="btn-primary header-cta" onClick={() => setFormOpen(true)}><MessageCircle size={16} /> Leave a message</button>
          </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={14} /> 60 years of growing impact</span>
          <h1>Rooted in Africa.<br /><span>Growing the future.</span></h1>
        </div>
      </section>

      <section className="section messages-section" id="messages">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <div className="kicker">The reason we’re here</div>
              <h2>Messages from our community.</h2>
              <p>Read and share messages celebrating IITA @60.</p>
            </div>
            <button className="btn-primary" onClick={() => setFormOpen(true)}><MessageCircle size={17} /> Share your message</button>
          </div>
          <CommentWall />
        </div>
      </section>

      {formOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}>
          <section className="comment-modal" role="dialog" aria-modal="true" aria-labelledby="comment-modal-title">
            <div className="modal-heading">
              <div><div className="kicker">Your voice belongs here</div><h2 id="comment-modal-title">Leave a message</h2></div>
              <button className="modal-close" aria-label="Close message form" onClick={() => setFormOpen(false)}><X size={20} /></button>
            </div>
            <p className="panel-subtitle">Share a memory, celebrate a milestone, or send your wishes to the IITA community.</p>
            <CommentForm onSubmitted={() => setFormOpen(false)} />
          </section>
        </div>
      )}

      <footer className="site-footer">
        <span>© IITA @60 · Celebrating six decades of impact</span>
        <span>Science · Partnerships · A food-secure Africa</span>
      </footer>
    </main>
  );
}

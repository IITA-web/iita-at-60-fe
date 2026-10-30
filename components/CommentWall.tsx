 "use client";

import { useEffect, useState } from "react";
import { ArrowDown, LoaderCircle, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { getPublicComments, PublicComment } from "@/lib/api";

const PAGE_SIZE = 12;

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function CommentWall() {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function loadComments() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await getPublicComments(page, PAGE_SIZE);
      setComments((previous) => {
        const existing = new Set(previous.map((item) => item.id));
        return [...previous, ...result.items.filter((item) => !existing.has(item.id))];
      });
      setPage(result.page + 1);
      setHasMore(result.has_more);
      setStarted(true);
    } catch (error) {
      toast.error("Couldn't load the messages", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setStarted(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadComments();
    // Load the first page once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="comment-list">
        {comments.map((comment) => (
          <article className="panel comment-card" key={comment.id}>
            <div className="quote-mark">“</div>
            <p className="comment-message">{comment.message}</p>
            <div className="comment-meta">
              <div>
                <div className="comment-name">{comment.name}</div>
                <div className="comment-date">{displayDate(comment.created_at)}</div>
              </div>
              <MessageSquareQuote size={19} color="#6f9666" aria-hidden="true" />
            </div>
          </article>
        ))}
        {started && !loading && comments.length === 0 && (
          <div className="empty-state">
            <MessageSquareQuote size={28} />
            <h3 className="mt-3 font-bold text-gray-800">Be the first to leave a message</h3>
            <p className="mt-2">Your words can be part of the IITA @60 story.</p>
          </div>
        )}
        {!started && loading && (
          <div className="empty-state">
            <LoaderCircle className="mx-auto animate-spin" size={26} />
            <p className="mt-3">Loading messages from the IITA community...</p>
          </div>
        )}
      </div>

      {hasMore && comments.length > 0 && (
        <div className="load-more-wrap">
          <button className="btn-light" onClick={loadComments} disabled={loading}>
            {loading ? <LoaderCircle size={17} className="animate-spin" /> : <ArrowDown size={17} />}
            {loading ? "Loading messages..." : "Load More Messages"}
          </button>
        </div>
      )}
      {!hasMore && comments.length > 0 && (
        <p className="mt-8 text-center text-sm text-gray-500">
          You’re all caught up. Thank you for celebrating with us.
        </p>
      )}
    </div>
  );
}

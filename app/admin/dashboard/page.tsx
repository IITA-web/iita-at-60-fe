 "use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, LogOut, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AdminComment, getAdminAnalytics, getAdminComments, moderateComment } from "@/lib/api";

type Analytics = { total: number; approved: number; pending: number; negative: number };

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ total: 0, approved: 0, pending: 0, negative: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [sentiment, setSentiment] = useState("");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const refresh = useCallback(async (authToken: string, currentPage: number) => {
    setLoading(true);
    try {
      const [result, stats] = await Promise.all([
        getAdminComments(authToken, { page: currentPage, limit: 20, status, sentiment, search }),
        getAdminAnalytics(authToken),
      ]);
      setComments(result.items);
      setTotal(result.total);
      setHasMore(result.has_more);
      setAnalytics(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load the admin dashboard.";
      toast.error("Dashboard request failed", { description: message });
      if (/token|credentials|authenticate|authorization|expired/i.test(message)) {
        sessionStorage.removeItem("iita_admin_token");
        router.replace("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [status, sentiment, search, router]);

  useEffect(() => {
    const saved = sessionStorage.getItem("iita_admin_token");
    if (!saved) {
      router.replace("/admin/login");
      return;
    }
    setToken(saved);
    void refresh(saved, page);
  // Initialize when the token is available; filter changes are handled below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) void refresh(token, page);
  }, [token, page, status, sentiment, refresh]);

  async function handleModeration(id: string, action: "approve" | "delete") {
    if (!token) return;
    if (action === "delete" && !window.confirm("Permanently delete this comment? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await moderateComment(token, id, action);
      toast.success(action === "approve" ? "Comment approved" : "Comment deleted", {
        description: action === "approve" ? "The message can now appear publicly." : "The message has been removed.",
      });
      await refresh(token, page);
    } catch (error) {
      toast.error("Moderation action failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusyId("");
    }
  }

  function logout() {
    sessionStorage.removeItem("iita_admin_token");
    toast.success("You have signed out");
    router.replace("/admin/login");
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link href="/" className="brand no-underline text-white">
          <span className="brand-mark" style={{ background: "#2b7950" }}>IITA</span>
          <span>IITA @60<small style={{ color: "#c9ddce" }}>Admin moderation</small></span>
        </Link>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => token && refresh(token, page)} disabled={loading}><RefreshCw size={16} /> Refresh</button>
          <button className="btn-outline" onClick={logout}><LogOut size={16} /> Sign out</button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <a href="#overview">Overview</a>
          <a href="#comments">Comment moderation</a>
          <Link href="/">Public website ↗</Link>
        </aside>
        <section className="admin-main">
          <div className="flex flex-wrap items-start justify-between gap-3" id="overview">
            <div>
              <div className="kicker">Moderation centre</div>
              <h1>Community messages</h1>
              <p className="muted mt-2">Review sentiment flags, approve legitimate feedback, and remove comments when necessary.</p>
            </div>
            <span className="status-pill approved"><ShieldCheck size={13} className="mr-1" /> Admin access</span>
          </div>

          <div className="metrics">
            <div className="panel metric"><span>Total submitted</span><strong>{analytics.total}</strong></div>
            <div className="panel metric"><span>Publicly approved</span><strong>{analytics.approved}</strong></div>
            <div className="panel metric"><span>Awaiting review</span><strong>{analytics.pending}</strong></div>
            <div className="panel metric"><span>Negative sentiment</span><strong>{analytics.negative}</strong></div>
          </div>

          <div className="panel panel-pad" id="comments">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3>Moderation queue</h3><p className="panel-subtitle mb-0">Only administrators can access pending messages and sentiment results.</p></div>
            </div>
            <div className="admin-toolbar">
              <select className="filter-select" aria-label="Filter by status" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} style={{ width: 170 }}>
                <option value="pending">Pending review</option>
                <option value="approved">Approved</option>
                <option value="deleted">Deleted</option>
                <option value="all">All statuses</option>
              </select>
              <select className="filter-select" aria-label="Filter by sentiment" value={sentiment} onChange={(e) => { setPage(1); setSentiment(e.target.value); }} style={{ width: 170 }}>
                <option value="">All sentiments</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
                <option value="positive">Positive</option>
                <option value="unknown">Unknown</option>
              </select>
              <input className="filter-input" placeholder="Search message or name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
              <button className="btn-light" onClick={() => { setPage(1); if (token) void refresh(token, 1); }}>Apply filters</button>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead><tr><th>Message</th><th>Sentiment</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id}>
                      <td style={{ maxWidth: 400 }}>
                        <strong>{comment.name}</strong>
                        <p className="mt-2 whitespace-pre-wrap leading-6">{comment.message}</p>
                      </td>
                      <td>
                        <span className={`status-pill ${comment.sentiment === "negative" ? "negative" : ""}`}>{comment.sentiment}</span>
                        <div className="mt-2 text-xs text-gray-500">{comment.sentiment_score === null ? "No score" : `Score: ${(comment.sentiment_score * 100).toFixed(1)}%`}</div>
                      </td>
                      <td><span className={`status-pill ${comment.status}`}>{comment.status}</span></td>
                      <td>{dateLabel(comment.created_at)}</td>
                      <td>
                        <div className="table-actions">
                          {comment.status !== "approved" && comment.status !== "deleted" && (
                            <button className="btn-primary" style={{ padding: ".55rem .7rem", fontSize: ".82rem" }} disabled={busyId === comment.id} onClick={() => void handleModeration(comment.id, "approve")}><Check size={14} /> Approve</button>
                          )}
                          {comment.status !== "deleted" && (
                            <button className="btn-danger" disabled={busyId === comment.id} onClick={() => void handleModeration(comment.id, "delete")}><Trash2 size={14} /> Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && comments.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500">No comments match these filters.</td></tr>}
                  {loading && <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading moderation queue…</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="pagination-info">Showing {comments.length} of {total} matching comments · Page {page}</span>
              <div className="flex gap-2">
                <button className="btn-light" disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={16} /> Previous</button>
                <button className="btn-light" disabled={!hasMore || loading} onClick={() => setPage((value) => value + 1)}>Next <ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

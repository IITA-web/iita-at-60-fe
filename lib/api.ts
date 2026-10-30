const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export type CommentStatus = "pending" | "approved" | "deleted";
export type Sentiment = "positive" | "neutral" | "negative" | "unknown";

export type PublicComment = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export type AdminComment = PublicComment & {
  sentiment: Sentiment;
  sentiment_score: number | null;
  status: CommentStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type PageResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = "Request failed. Please try again.";
    try {
      const body = await response.json();
      detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      // Use generic fallback if the response is not JSON.
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export async function submitComment(input: { name: string; message: string }) {
  const response = await fetch(`${API_URL}/api/v1/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<{ success: boolean; message: string; comment_id: string }>(response);
}

export async function getPublicComments(page: number, limit = 12) {
  const response = await fetch(
    `${API_URL}/api/v1/comments?page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );
  return parseResponse<PageResult<PublicComment>>(response);
}

export async function adminLogin(username: string, password: string) {
  const response = await fetch(`${API_URL}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseResponse<{ access_token: string; token_type: string }>(response);
}

export async function getAdminComments(
  token: string,
  options: { page: number; limit?: number; status?: string; sentiment?: string; search?: string },
) {
  const query = new URLSearchParams({
    page: String(options.page),
    limit: String(options.limit || 20),
  });
  if (options.status) query.set("status", options.status);
  if (options.sentiment) query.set("sentiment", options.sentiment);
  if (options.search) query.set("search", options.search);

  const response = await fetch(`${API_URL}/api/v1/admin/comments?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseResponse<PageResult<AdminComment>>(response);
}

export async function moderateComment(
  token: string,
  id: string,
  action: "approve" | "delete",
) {
  const response = await fetch(
    `${API_URL}/api/v1/admin/comments/${encodeURIComponent(id)}${action === "approve" ? "/approve" : ""}`,
    {
      method: action === "approve" ? "PATCH" : "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return parseResponse<{ success: boolean; message: string }>(response);
}

export async function getAdminAnalytics(token: string) {
  const response = await fetch(`${API_URL}/api/v1/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseResponse<{
    total: number;
    approved: number;
    pending: number;
    negative: number;
  }>(response);
}

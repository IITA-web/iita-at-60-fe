 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await adminLogin(username.trim(), password);
      sessionStorage.setItem("iita_admin_token", result.access_token);
      toast.success("Signed in successfully");
      router.replace("/admin/dashboard");
    } catch (error) {
      toast.error("Sign-in failed", {
        description: error instanceof Error ? error.message : "Check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-wrap">
      <section className="panel login-card">
        <Link href="/" className="brand no-underline text-inherit">
          <span className="brand-mark">IITA</span>
          <span>IITA @60<small>Moderation portal</small></span>
        </Link>
        <div className="mt-8 grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-800">
          <ShieldCheck size={25} />
        </div>
        <h1>Administrator sign in</h1>
        <p className="panel-subtitle">Sign in to review pending messages and manage the public comment wall.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          <button className="btn-primary w-full" disabled={loading} type="submit">
            <LockKeyhole size={17} /> {loading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>
        <p className="form-note">Administrator credentials are configured on the backend. Never expose them in frontend environment variables.</p>
        <Link href="/" className="mt-5 inline-block text-sm font-bold text-green-800 no-underline">← Back to the public website</Link>
      </section>
    </main>
  );
}

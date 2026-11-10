 "use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { submitComment } from "@/lib/api";

export default function CommentForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await submitComment({ name: name.trim(), message: message.trim() });
      window.dispatchEvent(new Event("comments:refresh"));
      // Deliberately show the same success response regardless of sentiment.
      toast.success("Your message has been received!", {
        description: "Thank you for being part of the IITA @60 celebration.",
      });
      setName("");
      setMessage("");
      onSubmitted?.();
    } catch (error) {
      toast.error("We couldn't submit your message", {
        description: error instanceof Error ? error.message : "Please try again shortly.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="visitor-name">Your name</label>
        <input
          id="visitor-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="How should we address you?"
          maxLength={100}
          autoComplete="name"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="visitor-message">Your anniversary message</label>
        <textarea
          id="visitor-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share a memory, a wish, or a message for IITA..."
          maxLength={2000}
          required
        />
      </div>
      <div className="form-foot">
        <span>Your message will be reviewed if needed.</span>
        <span>{message.length}/2000</span>
      </div>
      <button className="btn-primary w-full" type="submit" disabled={loading}>
        <MessageCircle size={17} />
        {loading ? "Sending message..." : "Share your message"}
        {!loading && <ArrowUpRight size={17} />}
      </button>
      <p className="form-note">
        By submitting, you agree that your message may be displayed publicly after moderation.
      </p>
    </form>
  );
}

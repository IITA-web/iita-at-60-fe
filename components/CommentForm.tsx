 "use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ArrowUpRight, ImagePlus, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { submitComment } from "@/lib/api";

export default function CommentForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureName, setProfilePictureName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await submitComment({ name: name.trim(), message: message.trim(), profile_picture: profilePicture });
      window.dispatchEvent(new Event("comments:refresh"));
      // Deliberately show the same success response regardless of sentiment.
      toast.success("Your message has been received!", {
        description: "Thank you for being part of the IITA @60 celebration.",
      });
      setName("");
      setMessage("");
      setProfilePicture(null);
      setProfilePictureName("");
      onSubmitted?.();
    } catch (error) {
      toast.error("We couldn't submit your message", {
        description: error instanceof Error ? error.message : "Please try again shortly.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handlePictureChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file to continue.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Your profile picture must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
        setProfilePictureName(file.name);
      }
    };
    reader.readAsDataURL(file);
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
        <label htmlFor="visitor-picture">Profile picture <span className="optional-label">Optional</span></label>
        <div className="profile-upload">
          {profilePicture ? (
            <>
              <img className="profile-preview" src={profilePicture} alt="Profile picture preview" />
              <span className="profile-file-name">{profilePictureName}</span>
              <button className="profile-remove" type="button" aria-label="Remove profile picture" onClick={() => { setProfilePicture(null); setProfilePictureName(""); }}><X size={16} /></button>
            </>
          ) : (
            <label className="profile-upload-label" htmlFor="visitor-picture"><ImagePlus size={19} /><span>Add a photo</span></label>
          )}
          <input id="visitor-picture" className="profile-file-input" type="file" accept="image/*" onChange={handlePictureChange} />
        </div>
        <span className="upload-hint">JPG, PNG, GIF, or WebP · up to 2 MB</span>
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

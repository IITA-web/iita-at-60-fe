"use client";

import { useState } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export default function CommentAvatar({ name, picture, className = "" }: {
  name: string;
  picture: string | null;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  const imageUrl = picture?.startsWith("/") ? `${API_URL}${picture}` : picture;

  return (
    <span className={`comment-avatar-fallback ${className}`} aria-label={`${name}'s profile`}>
      {imageUrl && !imageFailed ? (
        <img src={imageUrl} alt={`${name}'s profile`} onError={() => setImageFailed(true)} />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}

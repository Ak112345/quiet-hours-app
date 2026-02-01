"use client";

import { useTransition } from "react";
import { setPostedAction } from "@/app/actions/posts";

export default function MarkPostedButton({
  postId,
  posted,
}: {
  postId: string;
  posted: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const nextPosted = (!posted).toString();

  return (
    <form
      action={(fd) => {
        startTransition(() => setPostedAction(fd));
      }}
    >
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="nextPosted" value={nextPosted} />

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #ddd",
          background: posted ? "#fff" : "#111",
          color: posted ? "#111" : "#fff",
          cursor: isPending ? "not-allowed" : "pointer",
          minWidth: 120,
        }}
      >
        {isPending ? "Updating…" : posted ? "Mark Draft" : "Mark Posted"}
      </button>
    </form>
  );
}

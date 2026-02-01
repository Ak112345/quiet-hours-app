"use client";

import { supabase } from "@/lib/supabaseClient";

type Props = {
  postId: string;
  posted: boolean;
};

export default function MarkPostedButton({ postId, posted }: Props) {
  async function togglePosted() {
    await supabase
      .from("posts")
      .update({ posted: !posted })
      .eq("id", postId);

    window.location.reload();
  }

  return (
    <button
      onClick={togglePosted}
      style={{
        marginTop: 8,
        padding: "6px 10px",
        fontSize: 12,
        border: "1px solid #ccc",
        borderRadius: 6,
        cursor: "pointer",
        background: posted ? "#e5ffe5" : "#fff",
      }}
    >
      {posted ? "Mark as draft" : "Mark as posted"}
    </button>
  );
}

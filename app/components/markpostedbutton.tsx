"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  postId: string;
  posted: boolean;
};

export default function MarkPostedButton({ postId, posted }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localPosted, setLocalPosted] = useState(posted);

  async function togglePosted() {
    const next = !localPosted;

    // instant UI update
    setLocalPosted(next);

    const { error } = await supabase
      .from("posts")
      .update({ posted: next })
      .eq("id", postId);

    if (error) {
      // revert if failed
      setLocalPosted(!next);
      alert(error.message);
      return;
    }

    // refresh server data without reloading the page
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={togglePosted}
      disabled={isPending}
      style={{
        marginTop: 8,
        padding: "6px 10px",
        fontSize: 12,
        border: "1px solid #ccc",
        borderRadius: 6,
        cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.6 : 1,
        background: localPosted ? "#e5ffe5" : "#fff",
      }}
    >
      {isPending ? "saving..." : localPosted ? "Mark as draft" : "Mark as posted"}
    </button>
  );
}

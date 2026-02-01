"use client";

import { supabase } from "@/lib/supabaseClient";

type Props = {
  postId: string;
  posted: boolean;
};

export default function markpostedbutton({ postId, posted }: Props) {
  const togglePosted = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ posted: !posted })
      .eq("id", postId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  };

  return (
    <button
      onClick={togglePosted}
      style={{
        marginTop: 10,
        padding: "6px 10px",
        fontSize: 12,
        borderRadius: 6,
        border: "1px solid #ccc",
        background: posted ? "#e8ffe8" : "#fff",
        cursor: "pointer",
      }}
    >
      {posted ? "Mark as draft" : "Mark as posted"}
    </button>
  );
}

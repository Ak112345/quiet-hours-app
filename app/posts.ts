"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function setPostedAction(formData: FormData) {
  const postId = String(formData.get("postId") || "");
  const nextPostedRaw = String(formData.get("nextPosted") || "");
  const nextPosted = nextPostedRaw === "true";

  if (!postId) return;

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("posts")
    .update({ posted: nextPosted })
    .eq("id", postId);

  if (error) {
    // Keep it simple: no throw to avoid breaking UI; you can add toast later.
    return;
  }

  // ✅ Proper refresh of server-fetched data (no window.reload)
  revalidatePath("/");
}

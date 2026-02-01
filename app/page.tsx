import PostsPanel from "@/app/components/postspanel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PLATFORMS, type PostRow, type PostVM } from "@/lib/posts";

function formatLocalLabel(iso: string) {
  // ✅ LOCK formatting on the server so client never re-formats dates (prevents hydration mismatch)
  const d = new Date(iso);

  // Use a stable format; no reliance on client locale/timezone.
  // Example: 2026-02-01 16:04
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
}

export default async function Page() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, created_at, content, platform, scheduled_at, posted")
    .order("created_at", { ascending: false });

  const rows: PostRow[] = (data || []) as PostRow[];

  const posts: PostVM[] = rows.map((p) => {
    const platform =
      p.platform && (PLATFORMS as readonly string[]).includes(p.platform)
        ? p.platform
        : "unknown";

    return {
      id: p.id,
      content: p.content ?? "",
      platform: platform as PostVM["platform"],
      posted: !!p.posted,
      createdAtLabel: p.created_at ? formatLocalLabel(p.created_at) : "—",
      scheduledAtLabel: p.scheduled_at ? formatLocalLabel(p.scheduled_at) : null,
    };
  });

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Quiet Hours</h1>
        <p style={{ marginTop: 6, color: "#666" }}>
          Draft, filter, and track posts. Next: scheduling + platform workflows.
        </p>
        {error ? (
          <p style={{ color: "crimson", marginTop: 10 }}>
            Couldn’t load posts.
          </p>
        ) : null}
      </header>

      <PostsPanel posts={posts} />
    </main>
  );
}

import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, created_at, content, platform, scheduled_at, posted")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Quiet Hours</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>Latest posts</p>

      {error && (
        <div style={{ padding: 12, border: "1px solid #f00", marginTop: 16 }}>
          Error: {error.message}
        </div>
      )}

      {!error && (!posts || posts.length === 0) && (
        <p style={{ marginTop: 16 }}>No posts yet.</p>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {posts?.map((p) => (
          <div key={p.id} style={{ padding: 14, border: "1px solid #ddd", borderRadius: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
              {new Date(p.created_at).toLocaleString()} · {p.platform || "—"}
              {p.posted ? " · posted" : " · draft"}
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.4 }}>{p.content}</div>

            {p.scheduled_at && (
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                Scheduled: {new Date(p.scheduled_at).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

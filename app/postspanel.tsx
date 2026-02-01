"use client";

import { useState, useMemo } from "react";
import type { PostVM } from "@/lib/posts";
import FilterBar from "@/app/filterbar";
import PostTabs from "@/app/components/posttabs";
import PostList from "@/app/postlist";


type StatusFilter = "draft" | "posted" | "all";
type PlatformFilter = "all" | PostVM["platform"];

export default function PostsPanel({ posts }: { posts: PostVM[] }) {
  const [status, setStatus] = useState<StatusFilter>("draft");
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((p) => {
      const statusOk =
        status === "all" ? true : status === "posted" ? p.posted : !p.posted;

      const platformOk = platform === "all" ? true : p.platform === platform;

      const queryOk =
        q.length === 0
          ? true
          : p.content.toLowerCase().includes(q) ||
            p.platform.toLowerCase().includes(q);

      return statusOk && platformOk && queryOk;
    });
  }, [posts, status, platform, query]);

  return (
    <section>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <PostTabs value={status} onChange={setStatus} />
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          platform={platform}
          onPlatformChange={setPlatform}
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <PostList posts={filtered} emptyLabel="No posts match your filters." />
      </div>
    </section>
  );
}

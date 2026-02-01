"use client";

import type { PostVM } from "@/lib/posts";
import PostCard from "@/app/postcard";

export default function PostList({
  posts,
  emptyLabel,
}: {
  posts: PostVM[];
  emptyLabel: string;
}) {
  if (posts.length === 0) {
    return (
      <div
        style={{
          padding: 18,
          border: "1px dashed #ddd",
          borderRadius: 14,
          color: "#666",
          background: "#fff",
        }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

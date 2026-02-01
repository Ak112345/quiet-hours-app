"use client";

import type { PostVM } from "@/lib/posts";
import MarkPostedButton from "@/app/components/markpostedbutton";

export default function PostCard({ post }: { post: PostVM }) {
  return (
    <article
      style={{
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 14,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid #ddd",
                color: "#333",
              }}
            >
              {post.platform}
            </span>

            <span
              style={{
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid #ddd",
                color: post.posted ? "#0a7a2f" : "#7a4b00",
              }}
            >
              {post.posted ? "posted" : "draft"}
            </span>

            {post.scheduledAtLabel ? (
              <span
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  color: "#333",
                }}
              >
                scheduled: {post.scheduledAtLabel}
              </span>
            ) : null}
          </div>

          <p style={{ marginTop: 10, marginBottom: 10, whiteSpace: "pre-wrap" }}>
            {post.content}
          </p>

          <p style={{ margin: 0, fontSize: 12, color: "#777" }}>
            created: {post.createdAtLabel}
          </p>
        </div>

        <div>
          <MarkPostedButton postId={post.id} posted={post.posted} />
        </div>
      </div>
    </article>
  );
}

"use client";

import { PLATFORMS } from "@/lib/posts";

type PlatformFilter = "all" | "unknown" | (typeof PLATFORMS)[number];

export default function FilterBar({
  query,
  onQueryChange,
  platform,
  onPlatformChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  platform: PlatformFilter;
  onPlatformChange: (v: PlatformFilter) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 12,
        border: "1px solid #eee",
        borderRadius: 14,
        background: "#fafafa",
      }}
    >
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search content or platform…"
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #ddd",
          outline: "none",
          background: "#fff",
        }}
      />

      <select
        value={platform}
        onChange={(e) => onPlatformChange(e.target.value as PlatformFilter)}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        <option value="all">All platforms</option>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
        <option value="unknown">unknown</option>
      </select>

      <button
        type="button"
        disabled
        title="Next feature"
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #ddd",
          background: "#f2f2f2",
          color: "#777",
          cursor: "not-allowed",
        }}
      >
        Scheduled (next)
      </button>
    </div>
  );
}

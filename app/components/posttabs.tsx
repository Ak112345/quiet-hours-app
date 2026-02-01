"use client";

type StatusFilter = "draft" | "posted" | "all";

export default function PostTabs({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const Tab = ({
    id,
    label,
  }: {
    id: StatusFilter;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => onChange(id)}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: value === id ? "#111" : "#fff",
        color: value === id ? "#fff" : "#111",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Tab id="draft" label="Drafts" />
      <Tab id="posted" label="Posted" />
      <Tab id="all" label="All" />
    </div>
  );
}

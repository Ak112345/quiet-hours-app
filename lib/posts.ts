export const PLATFORMS = ["instagram", "tiktok", "youtube", "x"] as const;
export type Platform = (typeof PLATFORMS)[number];

export type PostRow = {
  id: string;
  created_at: string; // ISO string
  content: string;
  platform: Platform | null;
  scheduled_at: string | null; // ISO string or null
  posted: boolean;
};

export type PostVM = {
  id: string;
  content: string;
  platform: Platform | "unknown";
  posted: boolean;
  createdAtLabel: string;
  scheduledAtLabel: string | null;
};

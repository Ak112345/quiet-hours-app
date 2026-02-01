import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function createSupabaseServerClient() {
  const cookieStoreMaybe = cookies() as unknown;

  const getAll = () => {
    const store = cookieStoreMaybe as { getAll?: () => any[] };
    return store.getAll ? store.getAll() : [];
  };

  const setAll = (cookiesToSet: CookieToSet[]) => {
    const store = cookieStoreMaybe as {
      set?: (name: string, value: string, options?: any) => void;
    };

    try {
      if (!store.set) return;
      cookiesToSet.forEach(({ name, value, options }) => {
        store.set!(name, value, options);
      });
    } catch {
      // ignore
    }
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll, setAll } }
  );
}

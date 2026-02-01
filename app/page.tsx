import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .limit(5);

  return (
    <main style={{ padding: 20 }}>
      <h1>Quiet Hours</h1>
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
    </main>
  );
}


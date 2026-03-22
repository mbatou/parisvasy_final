export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ExperienceEditClient } from "./ExperienceEditClient";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const db = createAdminClient();
  const { data: experience, error } = await db
    .from('Experience')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !experience) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white font-serif">
          Edit Experience
        </h1>
        <p className="mt-1 text-sm text-white/40 font-sans">
          Update &ldquo;{experience.title}&rdquo;
        </p>
      </div>

      <div className="border border-white/[0.06] bg-pv-black-80 p-6">
        <ExperienceEditClient
          experience={JSON.parse(JSON.stringify(experience))}
        />
      </div>
    </div>
  );
}

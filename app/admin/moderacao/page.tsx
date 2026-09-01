import type { Metadata } from "next";
import { isAdmin, adminConfigured, listPending } from "@/lib/forum/admin";
import { AdminLogin, ModerationQueue } from "@/components/forum/ModerationClient";

// Fila de moderação nunca pode ser servida de cache — decisão tomada aqui
// precisa refletir na hora, e o conteúdo é privado.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moderação",
  robots: { index: false, follow: false },
};

export default async function ModeracaoPage() {
  const authed = await isAdmin();

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-5">
        {authed ? (
          <ModerationQueue items={await listPending()} />
        ) : (
          <AdminLogin configured={adminConfigured()} />
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  FileText,
  AlertTriangle,
  LogOut,
} from "lucide-react";

interface Item {
  kind: "thread" | "reply";
  id: number;
  title?: string;
  body: string;
  category?: string;
  author_name: string;
  author_email: string | null;
  moderation_reason: string | null;
  created_at: string;
  thread_title?: string;
}

async function post(payload: Record<string, unknown>) {
  const res = await fetch("/api/forum/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, data: await res.json() };
}

// ─── Tela de senha ───────────────────────────────────────────────────────────

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const { ok, data } = await post({ action: "login", secret });
    setLoading(false);
    if (ok) router.refresh();
    else setErr(data.error ?? "Falhou.");
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-[#CC0000]/25 bg-[#111111] p-8">
        <ShieldCheck className="mb-4 h-7 w-7 text-[#CC0000]" />
        <h1 className="font-heading text-[28px]! leading-tight text-[#F5F5F5]">Moderação</h1>
        <p className="mt-2 mb-6 font-sans text-sm text-[#A0A0A0]">
          Área restrita. Fila de posts retidos pela triagem.
        </p>

        {!configured ? (
          <div className="rounded-lg border border-[#E0A526]/30 bg-[#3a2000]/40 px-4 py-3">
            <p className="font-sans text-sm text-[#F5F5F5]">
              <code className="text-[#E0A526]">ADMIN_SECRET</code> não está
              configurada no servidor. Defina essa variável de ambiente para
              habilitar o acesso.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Senha de moderação"
              autoFocus
              className="w-full rounded-lg border border-[#CC0000]/20 bg-[#0d0d0d] px-4 py-3 text-sm text-[#F5F5F5] placeholder:text-[#606060] focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
            />
            {err && (
              <p className="font-sans text-sm text-[#E0A526]">{err}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#CC0000] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#a30000] disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Fila ────────────────────────────────────────────────────────────────────

export function ModerationQueue({ items }: { items: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, "approve" | "reject">>({});

  async function decide(item: Item, decision: "approve" | "reject") {
    const key = `${item.kind}:${item.id}`;
    setBusy(key);
    const { ok } = await post({
      action: "moderate",
      kind: item.kind,
      id: item.id,
      decision,
    });
    setBusy(null);
    if (ok) {
      setDone((d) => ({ ...d, [key]: decision }));
      setTimeout(() => router.refresh(), 600);
    }
  }

  async function logout() {
    await post({ action: "logout" });
    router.refresh();
  }

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[clamp(30px,5vw,44px)]! uppercase leading-none text-[#F5F5F5]">
            Moderação
          </h1>
          <p className="mt-2 font-sans text-sm text-[#A0A0A0]">
            {items.length === 0
              ? "Nada retido. A fila está limpa."
              : `${items.length} ${items.length === 1 ? "item retido" : "itens retidos"} esperando sua decisão.`}
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#CC0000]/25 px-4 py-2 font-sans text-sm text-[#A0A0A0] transition-colors hover:border-[#CC0000] hover:text-[#F5F5F5]"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-[#CC0000]/20 bg-[#111111] px-6 py-16 text-center">
          <Check className="mx-auto mb-4 h-8 w-8 text-[#2E9E5B]" />
          <p className="font-sans text-sm text-[#A0A0A0]">
            Nenhum post aguardando revisão.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const key = `${item.kind}:${item.id}`;
            const decided = done[key];
            return (
              <li
                key={key}
                className={`rounded-xl border p-6 transition-all ${
                  decided === "approve"
                    ? "border-[#2E9E5B]/40 bg-[#0d1a12] opacity-60"
                    : decided === "reject"
                      ? "border-[#606060]/30 bg-[#141414] opacity-50"
                      : "border-[#CC0000]/25 bg-[#111111]"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CC0000]/30 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#CC0000]">
                    {item.kind === "thread" ? (
                      <>
                        <FileText className="h-3 w-3" /> Tópico
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-3 w-3" /> Resposta
                      </>
                    )}
                  </span>
                  <span className="font-sans text-xs text-[#606060]">
                    {item.author_name}
                    {item.author_email ? ` · ${item.author_email}` : ""} ·{" "}
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>

                {item.kind === "reply" && item.thread_title && (
                  <p className="mb-2 font-sans text-xs text-[#606060]">
                    em: <span className="text-[#A0A0A0]">{item.thread_title}</span>
                  </p>
                )}

                {item.title && (
                  <h2 className="mb-2 font-heading text-[22px] leading-tight text-[#F5F5F5]">
                    {item.title}
                  </h2>
                )}

                <p className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-[#D5D5D5]">
                  {item.body}
                </p>

                {item.moderation_reason && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#E0A526]/25 bg-[#2a1c00]/40 px-4 py-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E0A526]" />
                    <p className="font-sans text-sm text-[#E8D5A8]">
                      <span className="font-semibold">Motivo da retenção:</span>{" "}
                      {item.moderation_reason}
                    </p>
                  </div>
                )}

                {decided ? (
                  <p className="mt-4 font-sans text-sm font-semibold text-[#A0A0A0]">
                    {decided === "approve" ? "✓ Publicado" : "✕ Rejeitado"}
                  </p>
                ) : (
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => decide(item, "approve")}
                      disabled={busy === key}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#2E9E5B] px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#268049] disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Publicar
                    </button>
                    <button
                      onClick={() => decide(item, "reject")}
                      disabled={busy === key}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#CC0000]/30 px-5 py-2.5 font-sans text-sm font-semibold text-[#A0A0A0] transition-colors hover:border-[#CC0000] hover:text-[#F5F5F5] disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Rejeitar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

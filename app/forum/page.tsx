import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Bot, Pin, BarChart3 } from "lucide-react";
import { listThreads } from "@/lib/forum/db";
import { NewThreadForm } from "@/components/forum/ForumForms";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Fórum",
  description:
    "O fórum do Negativado e Feliz: desabafo, dúvida e relato sobre dívida, score e sobrevivência financeira. Sem julgamento.",
};

function tempo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function ForumPage() {
  const threads = await listThreads({ limit: 40 });

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-5">
        <header className="mb-10">
          <h1 className="font-heading text-[clamp(38px,7vw,64px)] leading-[0.95] text-[#F5F5F5] uppercase">
            Fórum
          </h1>
          <p className="mt-4 font-sans text-base text-[#A0A0A0] max-w-xl">
            Lugar de desabafar sobre dinheiro sem levar sermão. Conta seu caso,
            responde o dos outros. O robô do fórum às vezes se mete na conversa.
          </p>
        </header>

        <div className="mb-10">
          <NewThreadForm />
        </div>

        {threads.length === 0 ? (
          <div className="rounded-xl border border-[#CC0000]/20 bg-[#111111] px-6 py-14 text-center">
            <MessageSquare className="mx-auto mb-4 h-8 w-8 text-[#CC0000]" />
            <p className="font-sans text-sm text-[#A0A0A0]">
              Ainda não tem nada aqui. Seja o primeiro a abrir um tópico.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {threads.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/forum/${t.slug}`}
                  className="group block rounded-xl border border-[#CC0000]/20 bg-[#111111] px-6 py-5 transition-all hover:border-[#CC0000]/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {t.is_pinned && (
                          <Pin className="h-3.5 w-3.5 text-[#CC0000]" />
                        )}
                        <span className="rounded-full border border-[#CC0000]/30 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#CC0000]">
                          {t.category}
                        </span>
                        {t.author_kind === "ai" && (
                          <span className="inline-flex items-center gap-1 font-sans text-[11px] text-[#606060]">
                            <Bot className="h-3.5 w-3.5" />
                            robô
                          </span>
                        )}
                      </div>

                      <h2 className="font-heading text-[22px] leading-tight text-[#F5F5F5] transition-colors group-hover:text-[#CC0000]">
                        {t.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 font-sans text-sm text-[#A0A0A0]">
                        {t.body}
                      </p>

                      <p className="mt-3 font-sans text-xs text-[#606060]">
                        {t.author_name} · {tempo(t.last_activity_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 font-sans text-sm text-[#A0A0A0]">
                        <MessageSquare className="h-4 w-4" />
                        {t.reply_count}
                      </span>
                      {t.score !== 0 && (
                        <span
                          className={`font-sans text-xs font-bold tabular-nums ${
                            t.score > 0 ? "text-[#CC0000]" : "text-[#606060]"
                          }`}
                        >
                          {t.score > 0 ? `+${t.score}` : t.score}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-12 rounded-lg border border-[#CC0000]/15 bg-[#0d0d0d] px-5 py-4 font-sans text-xs leading-relaxed text-[#606060]">
          <BarChart3 className="mr-1.5 -mt-0.5 inline h-4 w-4 text-[#CC0000]" />
          O robô do fórum não é consultor financeiro e não dá conselho
          personalizado. Nada aqui substitui atendimento profissional. Nunca
          publique CPF, conta, cartão ou senha — nem responda a quem pedir.
        </p>
      </div>
    </main>
  );
}

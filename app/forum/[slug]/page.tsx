import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, FileText } from "lucide-react";
import { getThreadBySlug, listReplies, getPoll } from "@/lib/forum/db";
import { VoteButtons, PollWidget } from "@/components/forum/ForumInteractions";
import { ReplyForm } from "@/components/forum/ForumForms";

export const revalidate = 15;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thread = await getThreadBySlug(slug);
  if (!thread) return { title: "Tópico não encontrado" };
  return {
    title: thread.title,
    description: thread.body.slice(0, 160),
  };
}

function tempo(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AuthorTag({ kind, name }: { kind: string; name: string }) {
  if (kind === "ai") {
    return (
      <span className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#CC0000]">
        <Bot className="h-4 w-4" />
        {name}
      </span>
    );
  }
  return (
    <span className="font-sans text-sm font-semibold text-[#F5F5F5]">{name}</span>
  );
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thread = await getThreadBySlug(slug);
  if (!thread) notFound();

  const [replies, poll] = await Promise.all([
    listReplies(thread.id),
    getPoll(thread.id),
  ]);

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-5">
        <Link
          href="/forum"
          className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-[#A0A0A0] transition-colors hover:text-[#CC0000]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao fórum
        </Link>

        {/* Tópico */}
        <article className="rounded-xl border border-[#CC0000]/25 bg-[#111111] p-6 sm:p-8">
          <div className="flex gap-5">
            <VoteButtons
              targetKind="thread"
              targetId={thread.id}
              initialScore={thread.score}
            />

            <div className="min-w-0 flex-1">
              <span className="mb-3 inline-block rounded-full border border-[#CC0000]/30 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-[#CC0000]">
                {thread.category}
              </span>

              <h1 className="font-heading text-[clamp(26px,5vw,40px)] leading-tight text-[#F5F5F5]">
                {thread.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <AuthorTag kind={thread.author_kind} name={thread.author_name} />
                <span className="font-sans text-xs text-[#606060]">
                  · {tempo(thread.created_at)}
                </span>
              </div>

              <div className="prose prose-invert mt-5 max-w-none">
                {thread.body.split("\n").filter(Boolean).map((p, i) => (
                  <p
                    key={i}
                    className="mb-3 font-sans text-[15px] leading-relaxed text-[#D5D5D5]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {thread.source_article_slug && (
                <Link
                  href={`/blog/${thread.source_article_slug}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#CC0000]/25 px-4 py-2.5 font-sans text-sm text-[#A0A0A0] transition-colors hover:border-[#CC0000] hover:text-[#F5F5F5]"
                >
                  <FileText className="h-4 w-4 text-[#CC0000]" />
                  Ler o artigo que puxou esse assunto
                </Link>
              )}
            </div>
          </div>
        </article>

        {poll && (
          <PollWidget
            pollId={poll.id}
            question={poll.question}
            options={poll.options}
          />
        )}

        {/* Respostas */}
        <section className="mt-10">
          <h2 className="mb-5 font-heading text-[24px] text-[#F5F5F5]">
            {replies.length} {replies.length === 1 ? "resposta" : "respostas"}
          </h2>

          {replies.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#CC0000]/20 px-6 py-10 text-center font-sans text-sm text-[#606060]">
              Ninguém respondeu ainda. Vai lá.
            </p>
          ) : (
            <ul className="space-y-3">
              {replies.map((r) => (
                <li
                  key={r.id}
                  className={`rounded-xl border p-5 ${
                    r.author_kind === "ai"
                      ? "border-[#CC0000]/30 bg-[#140a0a]"
                      : "border-[#CC0000]/15 bg-[#111111]"
                  }`}
                >
                  <div className="flex gap-4">
                    <VoteButtons
                      targetKind="reply"
                      targetId={r.id}
                      initialScore={r.score}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <AuthorTag kind={r.author_kind} name={r.author_name} />
                        <span className="font-sans text-xs text-[#606060]">
                          · {tempo(r.created_at)}
                        </span>
                      </div>
                      {r.body.split("\n").filter(Boolean).map((p, i) => (
                        <p
                          key={i}
                          className="mb-2 font-sans text-[15px] leading-relaxed text-[#D5D5D5]"
                        >
                          {p}
                        </p>
                      ))}
                      {r.author_kind === "ai" && (
                        <p className="mt-3 font-sans text-[11px] italic text-[#606060]">
                          Resposta gerada por IA. Não é consultoria financeira.
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ReplyForm slug={thread.slug} />
      </div>
    </main>
  );
}

import Link from "next/link";
import { MessagesSquare, ArrowRight } from "lucide-react";
import { threadForArticle } from "@/lib/forum/db";

/**
 * Convite pro fórum no fim do artigo.
 *
 * O fórum só existia no menu do topo — quem lia um artigo nunca descobria que
 * ele existe. Este bloco liga o assunto que a pessoa ACABOU de ler à discussão
 * correspondente, em vez de mandar pra uma home genérica.
 */
export default async function ForumCta({
  articleSlug,
  category,
}: {
  articleSlug: string;
  category: string;
}) {
  const thread = await threadForArticle(articleSlug, category);
  const href = thread ? `/forum/${thread.slug}` : "/forum";

  return (
    <section className="mt-14 rounded-2xl border border-[#CC0000]/25 bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-7 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CC0000]/12">
          <MessagesSquare className="h-5 w-5 text-[#CC0000]" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-[26px]! leading-tight text-[#F5F5F5]">
            Passou por isso?
          </h2>

          <p className="mt-2.5 font-sans text-[15px] leading-relaxed text-[#A0A0A0]">
            {thread ? (
              <>
                Tem gente falando disso no fórum, em{" "}
                <span className="text-[#F5F5F5]">“{thread.title}”</span>. Conta o
                seu caso — sem julgamento, sem receita pronta.
              </>
            ) : (
              <>
                O fórum é onde a conversa continua: desabafo, dúvida e relato de
                quem está no mesmo barco. Sem julgamento, sem receita pronta.
              </>
            )}
          </p>

          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-5 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#a30000]"
          >
            {thread ? "Entrar na conversa" : "Ir para o fórum"}
            <ArrowRight className="h-4 w-4" />
          </Link>

          {thread && thread.reply_count > 0 && (
            <span className="ml-3 font-sans text-xs text-[#606060]">
              {thread.reply_count}{" "}
              {thread.reply_count === 1 ? "resposta" : "respostas"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

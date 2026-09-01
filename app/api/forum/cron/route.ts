import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/data";
import {
  articleHasThread,
  createThread,
  createPoll,
  listThreads,
} from "@/lib/forum/db";
import {
  aiEnabled,
  generateThreadFromArticle,
  generatePoll,
  AI_AUTHOR_NAME,
} from "@/lib/forum/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Cron do fórum: a IA abre um tópico a partir de um artigo ainda não discutido
 * e, alternadamente, cria uma enquete.
 *
 * Protegido por segredo — sem isso, qualquer um dispara geração de conteúdo
 * na conta da Anthropic do dono do site.
 */
export async function GET(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-cron-secret") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const expected = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!aiEnabled()) {
    return NextResponse.json({
      ok: false,
      reason: "ANTHROPIC_API_KEY não configurada — nada a fazer",
    });
  }

  const mode = request.nextUrl.searchParams.get("mode") ?? "auto";
  const results: Record<string, unknown> = {};

  // ─── Enquete ───────────────────────────────────────────────────────────────
  if (mode === "poll" || mode === "auto") {
    const recent = await listThreads({ limit: 15 });
    const poll = await generatePoll({ recentTitles: recent.map((t) => t.title) });
    if (poll) {
      const thread = await createThread({
        title: poll.title,
        body: poll.body,
        category: poll.category,
        authorKind: "ai",
        authorName: AI_AUTHOR_NAME,
        status: "published", // conteúdo próprio da IA, já nasce dentro das regras
      });
      await createPoll({
        threadId: thread.id,
        question: poll.question,
        options: poll.options,
      });
      results.poll = { slug: thread.slug, question: poll.question };
    } else {
      results.poll = "não gerada (teto diário ou falha)";
    }
  }

  // ─── Tópico a partir de artigo ─────────────────────────────────────────────
  if (mode === "topic" || mode === "auto") {
    const posts = await getAllPosts();
    let picked = null;
    // varre os mais recentes até achar um que ainda não virou discussão
    for (const p of posts.slice(0, 40)) {
      if (!(await articleHasThread(p.slug))) {
        picked = p;
        break;
      }
    }

    if (!picked) {
      results.topic = "todos os artigos recentes já têm tópico";
    } else {
      const gen = await generateThreadFromArticle({
        articleTitle: picked.title,
        articleDescription: picked.description,
        articleCategory: picked.category,
        articleSlug: picked.slug,
      });
      if (gen) {
        const thread = await createThread({
          title: gen.title,
          body: gen.body,
          category: gen.category,
          authorKind: "ai",
          authorName: AI_AUTHOR_NAME,
          sourceArticleSlug: picked.slug,
          status: "published",
        });
        results.topic = { slug: thread.slug, from: picked.slug };
      } else {
        results.topic = "não gerado (teto diário ou falha)";
      }
    }
  }

  return NextResponse.json({ ok: true, ...results });
}

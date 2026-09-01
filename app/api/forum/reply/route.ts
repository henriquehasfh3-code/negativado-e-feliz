import { NextRequest, NextResponse } from "next/server";
import {
  createReply,
  getThreadBySlug,
  listReplies,
} from "@/lib/forum/db";
import { moderatePost, generateReply, AI_AUTHOR_NAME } from "@/lib/forum/ai";
import { keyFromRequest, rateLimit, cleanText, validEmail } from "@/lib/forum/request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const key = keyFromRequest(request);
  if (!rateLimit(`reply:${key}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Você respondeu muita coisa nesta hora. Respira." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const slug = cleanText(payload.slug, 120);
  const body = cleanText(payload.body, 4000);
  const authorName = cleanText(payload.authorName, 40) || "Anônimo";
  const authorEmail = cleanText(payload.authorEmail, 120);
  const parentId = typeof payload.parentId === "number" ? payload.parentId : null;
  const askAi = payload.askAi === true;

  if (body.length < 5) {
    return NextResponse.json({ error: "Resposta vazia." }, { status: 400 });
  }
  if (!validEmail(authorEmail)) {
    return NextResponse.json({ error: "Esse e-mail não parece válido." }, { status: 400 });
  }

  const thread = await getThreadBySlug(slug);
  if (!thread) {
    return NextResponse.json({ error: "Tópico não encontrado" }, { status: 404 });
  }

  const verdict = await moderatePost({ body, authorName });
  const published = verdict.decision === "publish";

  await createReply({
    threadId: thread.id,
    parentId,
    body,
    authorName,
    authorEmail: authorEmail || null,
    status: published ? "published" : "pending",
    moderationReason: verdict.reason,
  });

  // A IA só responde a conteúdo que passou na triagem. Responder a post retido
  // seria dar palco justamente pro que a moderação barrou.
  let aiReplied = false;
  if (published && askAi) {
    const existing = await listReplies(thread.id);
    const aiText = await generateReply({
      threadTitle: thread.title,
      threadBody: thread.body,
      recentReplies: existing.map((r) => ({ author: r.author_name, body: r.body })),
      question: body,
    });
    if (aiText) {
      await createReply({
        threadId: thread.id,
        body: aiText,
        authorKind: "ai",
        authorName: AI_AUTHOR_NAME,
        status: "published",
      });
      aiReplied = true;
    }
  }

  return NextResponse.json({
    ok: true,
    published,
    aiReplied,
    message: published
      ? "Resposta publicada."
      : "Recebido! Passa por uma conferida antes de aparecer.",
  });
}

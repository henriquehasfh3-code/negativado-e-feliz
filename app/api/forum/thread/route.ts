import { NextRequest, NextResponse } from "next/server";
import { createThread } from "@/lib/forum/db";
import { moderatePost } from "@/lib/forum/ai";
import { keyFromRequest, rateLimit, cleanText, validEmail } from "@/lib/forum/request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const key = keyFromRequest(request);
  if (!rateLimit(`thread:${key}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Calma. Você já abriu tópicos demais nesta hora." },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const title = cleanText(payload.title, 140);
  const body = cleanText(payload.body, 5000);
  const authorName = cleanText(payload.authorName, 40) || "Anônimo";
  const authorEmail = cleanText(payload.authorEmail, 120);
  const category = cleanText(payload.category, 40) || "Geral";

  if (title.length < 8) {
    return NextResponse.json({ error: "O título ficou curto demais." }, { status: 400 });
  }
  if (body.length < 20) {
    return NextResponse.json({ error: "Escreve um pouco mais, vai." }, { status: 400 });
  }
  if (!validEmail(authorEmail)) {
    return NextResponse.json({ error: "Esse e-mail não parece válido." }, { status: 400 });
  }

  // Triagem antes de qualquer coisa aparecer. Falha fechada.
  const verdict = await moderatePost({ title, body, authorName });

  const thread = await createThread({
    title,
    body,
    category,
    authorName,
    authorEmail: authorEmail || null,
    status: verdict.decision === "publish" ? "published" : "pending",
    moderationReason: verdict.reason,
  });

  return NextResponse.json({
    ok: true,
    published: thread.status === "published",
    slug: thread.slug,
    message:
      thread.status === "published"
        ? "Tópico no ar."
        : "Recebido! Passa por uma conferida antes de aparecer no fórum.",
  });
}

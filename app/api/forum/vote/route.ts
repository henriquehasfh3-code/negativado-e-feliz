import { NextRequest, NextResponse } from "next/server";
import { castVote, castPollVote } from "@/lib/forum/db";
import { keyFromRequest, rateLimit } from "@/lib/forum/request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const key = keyFromRequest(request);
  if (!rateLimit(`vote:${key}`, 60, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Votos demais." }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  // voto em enquete
  if (payload.kind === "poll") {
    const pollId = Number(payload.pollId);
    const optionId = Number(payload.optionId);
    if (!Number.isInteger(pollId) || !Number.isInteger(optionId)) {
      return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
    }
    const counted = await castPollVote({ pollId, optionId, voterKey: key });
    return NextResponse.json({
      ok: true,
      counted,
      message: counted ? "Voto computado." : "Você já votou nesta enquete.",
    });
  }

  // voto em tópico ou resposta
  const targetKind = payload.targetKind === "reply" ? "reply" : "thread";
  const targetId = Number(payload.targetId);
  const value = payload.value === -1 ? -1 : 1;
  if (!Number.isInteger(targetId)) {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const score = await castVote({ targetKind, targetId, voterKey: key, value });
  return NextResponse.json({ ok: true, score });
}

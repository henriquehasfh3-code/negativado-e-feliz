import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  isAdmin,
  tokenForSecret,
  moderateItem,
  adminConfigured,
} from "@/lib/forum/admin";
import { rateLimit, keyFromRequest } from "@/lib/forum/request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  // ─── Login ─────────────────────────────────────────────────────────────────
  if (payload.action === "login") {
    if (!adminConfigured()) {
      return NextResponse.json(
        { error: "ADMIN_SECRET não configurada no servidor." },
        { status: 503 },
      );
    }
    // Freio contra tentativa de força bruta na senha
    const key = keyFromRequest(request);
    if (!rateLimit(`admin-login:${key}`, 8, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Tentativas demais. Espera 15 minutos." },
        { status: 429 },
      );
    }

    const token = tokenForSecret(String(payload.secret ?? ""));
    if (!token) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  }

  // ─── Daqui pra baixo exige sessão ──────────────────────────────────────────
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (payload.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  if (payload.action === "moderate") {
    const kind = payload.kind === "reply" ? "reply" : "thread";
    const id = Number(payload.id);
    const decision = payload.decision;

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    if (decision !== "approve" && decision !== "reject") {
      return NextResponse.json({ error: "Decisão inválida" }, { status: 400 });
    }

    await moderateItem({
      kind,
      id,
      status: decision === "approve" ? "published" : "rejected",
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
}

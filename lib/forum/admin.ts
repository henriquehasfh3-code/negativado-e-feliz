import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import { cookies } from "next/headers";
import type { PostStatus } from "./db";

const sql = neon(process.env.DATABASE_URL || "postgresql://user:pass@localhost/none");

export const ADMIN_COOKIE = "nf_admin";

/**
 * Sessão de admin sem sistema de contas.
 *
 * O cookie guarda um HMAC derivado do segredo, não o segredo em si — quem
 * capturar o cookie não descobre a senha. Comparação em tempo constante para
 * não vazar informação por diferença de tempo de resposta.
 */
function expectedToken(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("nf-admin-v1").digest("hex");
}

export function tokenForSecret(candidate: string): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return expectedToken();
}

export async function isAdmin(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const got = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!got || got.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET);
}

// ─── Fila de moderação ───────────────────────────────────────────────────────

export interface PendingThread {
  kind: "thread";
  id: number;
  slug: string;
  title: string;
  body: string;
  category: string;
  author_name: string;
  author_email: string | null;
  moderation_reason: string | null;
  created_at: string;
}

export interface PendingReply {
  kind: "reply";
  id: number;
  body: string;
  author_name: string;
  author_email: string | null;
  moderation_reason: string | null;
  created_at: string;
  thread_title: string;
  thread_slug: string;
}

export type PendingItem = PendingThread | PendingReply;

export async function listPending(): Promise<PendingItem[]> {
  if (!process.env.DATABASE_URL) return [];

  const threads = (await sql`
    SELECT id, slug, title, body, category, author_name, author_email,
           moderation_reason, created_at
    FROM forum_threads
    WHERE status = 'pending'
    ORDER BY created_at DESC
    LIMIT 100
  `) as Omit<PendingThread, "kind">[];

  const replies = (await sql`
    SELECT r.id, r.body, r.author_name, r.author_email, r.moderation_reason,
           r.created_at, t.title AS thread_title, t.slug AS thread_slug
    FROM forum_replies r
    JOIN forum_threads t ON t.id = r.thread_id
    WHERE r.status = 'pending'
    ORDER BY r.created_at DESC
    LIMIT 100
  `) as Omit<PendingReply, "kind">[];

  const all: PendingItem[] = [
    ...threads.map((t) => ({ ...t, kind: "thread" as const })),
    ...replies.map((r) => ({ ...r, kind: "reply" as const })),
  ];
  return all.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function countPending(): Promise<number> {
  if (!process.env.DATABASE_URL) return 0;
  const rows = (await sql`
    SELECT
      (SELECT COUNT(*) FROM forum_threads WHERE status = 'pending') +
      (SELECT COUNT(*) FROM forum_replies WHERE status = 'pending') AS n
  `) as { n: string }[];
  return Number(rows[0]?.n ?? 0);
}

export async function moderateItem(input: {
  kind: "thread" | "reply";
  id: number;
  status: PostStatus;
}): Promise<void> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");

  if (input.kind === "thread") {
    await sql`
      UPDATE forum_threads SET status = ${input.status} WHERE id = ${input.id}
    `;
    return;
  }

  // Liberar resposta precisa acertar o contador e reordenar o feed — o
  // createReply só incrementa quando já nasce publicada.
  const rows = (await sql`
    SELECT thread_id, status FROM forum_replies WHERE id = ${input.id}
  `) as { thread_id: number; status: PostStatus }[];
  if (!rows[0]) return;

  const wasPublished = rows[0].status === "published";
  await sql`UPDATE forum_replies SET status = ${input.status} WHERE id = ${input.id}`;

  if (input.status === "published" && !wasPublished) {
    await sql`
      UPDATE forum_threads
      SET reply_count = reply_count + 1, last_activity_at = NOW()
      WHERE id = ${rows[0].thread_id}
    `;
  } else if (input.status !== "published" && wasPublished) {
    await sql`
      UPDATE forum_threads
      SET reply_count = GREATEST(reply_count - 1, 0)
      WHERE id = ${rows[0].thread_id}
    `;
  }
}

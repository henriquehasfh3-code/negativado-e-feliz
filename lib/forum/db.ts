import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

// Sem DATABASE_URL o fórum fica inerte, mas o resto do site continua buildando
// e no ar. Uma variável de ambiente faltando não pode derrubar o blog inteiro.
export const forumConfigured = Boolean(process.env.DATABASE_URL);

// URL de placeholder só pra não estourar no carregamento do módulo; toda função
// de leitura curto-circuita antes de usar a conexão quando não há configuração.
const sql = neon(process.env.DATABASE_URL || "postgresql://user:pass@localhost/none");

function requireDb() {
  if (!forumConfigured) {
    throw new Error("DATABASE_URL não configurada — fórum indisponível");
  }
}

export type AuthorKind = "human" | "ai" | "admin";
export type PostStatus = "pending" | "published" | "rejected" | "hidden";

export interface Thread {
  id: number;
  slug: string;
  title: string;
  body: string;
  category: string;
  author_kind: AuthorKind;
  author_name: string;
  author_email: string | null;
  source_article_slug: string | null;
  status: PostStatus;
  moderation_reason: string | null;
  is_pinned: boolean;
  reply_count: number;
  score: number;
  created_at: string;
  last_activity_at: string;
}

export interface Reply {
  id: number;
  thread_id: number;
  parent_id: number | null;
  body: string;
  author_kind: AuthorKind;
  author_name: string;
  author_email: string | null;
  status: PostStatus;
  score: number;
  created_at: string;
}

export interface PollOption {
  id: number;
  poll_id: number;
  label: string;
  position: number;
  vote_count: number;
}

export interface Poll {
  id: number;
  thread_id: number;
  question: string;
  closes_at: string | null;
  options: PollOption[];
}

// ─── Identidade de voto sem login ────────────────────────────────────────────
// Hash de IP + user-agent + salt do servidor. Isso impede o clique repetido
// casual, não um fraudador determinado. Sem conta de usuário, esse é o teto
// honesto — não vale prometer mais do que entrega.
export function voterKey(ip: string, userAgent: string): string {
  const salt = process.env.FORUM_VOTE_SALT || "negativado-e-feliz-fallback-salt";
  return crypto
    .createHash("sha256")
    .update(`${ip}|${userAgent}|${salt}`)
    .digest("hex")
    .slice(0, 32);
}

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
  // sufixo curto evita colisão sem precisar de round-trip extra ao banco
  return `${base}-${crypto.randomBytes(3).toString("hex")}`;
}

// ─── Leitura ─────────────────────────────────────────────────────────────────

export async function listThreads(opts: {
  category?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<Thread[]> {
  if (!forumConfigured) return [];
  const { category, limit = 30, offset = 0 } = opts;
  if (category && category !== "Todos") {
    return (await sql`
      SELECT * FROM forum_threads
      WHERE status = 'published' AND category = ${category}
      ORDER BY is_pinned DESC, last_activity_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `) as Thread[];
  }
  return (await sql`
    SELECT * FROM forum_threads
    WHERE status = 'published'
    ORDER BY is_pinned DESC, last_activity_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as Thread[];
}

export async function getThreadBySlug(slug: string): Promise<Thread | null> {
  if (!forumConfigured) return null;
  const rows = (await sql`
    SELECT * FROM forum_threads WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `) as Thread[];
  return rows[0] ?? null;
}

export async function listReplies(threadId: number): Promise<Reply[]> {
  if (!forumConfigured) return [];
  return (await sql`
    SELECT * FROM forum_replies
    WHERE thread_id = ${threadId} AND status = 'published'
    ORDER BY created_at ASC
  `) as Reply[];
}

export async function getPoll(threadId: number): Promise<Poll | null> {
  if (!forumConfigured) return null;
  const polls = (await sql`
    SELECT * FROM forum_polls WHERE thread_id = ${threadId} LIMIT 1
  `) as Poll[];
  if (!polls[0]) return null;
  const options = (await sql`
    SELECT * FROM forum_poll_options WHERE poll_id = ${polls[0].id} ORDER BY position ASC
  `) as PollOption[];
  return { ...polls[0], options };
}

export async function listCategories(): Promise<string[]> {
  if (!forumConfigured) return [];
  const rows = (await sql`
    SELECT DISTINCT category FROM forum_threads WHERE status = 'published' ORDER BY category
  `) as { category: string }[];
  return rows.map((r) => r.category);
}

/**
 * Acha a melhor discussão para puxar o leitor de um artigo.
 *
 * Prioridade: tópico aberto a partir DESTE artigo > tópico da mesma categoria
 * com mais movimento > nada (aí o convite leva ao fórum geral).
 */
export async function threadForArticle(
  articleSlug: string,
  category: string,
): Promise<{ slug: string; title: string; reply_count: number } | null> {
  if (!forumConfigured) return null;

  const doArtigo = (await sql`
    SELECT slug, title, reply_count FROM forum_threads
    WHERE source_article_slug = ${articleSlug} AND status = 'published'
    ORDER BY last_activity_at DESC LIMIT 1
  `) as { slug: string; title: string; reply_count: number }[];
  if (doArtigo[0]) return doArtigo[0];

  const daCategoria = (await sql`
    SELECT slug, title, reply_count FROM forum_threads
    WHERE category = ${category} AND status = 'published'
    ORDER BY reply_count DESC, last_activity_at DESC LIMIT 1
  `) as { slug: string; title: string; reply_count: number }[];
  return daCategoria[0] ?? null;
}

/** Tópicos já abertos pela IA para um artigo — evita duplicar assunto. */
export async function articleHasThread(articleSlug: string): Promise<boolean> {
  if (!forumConfigured) return true;
  const rows = (await sql`
    SELECT 1 FROM forum_threads WHERE source_article_slug = ${articleSlug} LIMIT 1
  `) as unknown[];
  return rows.length > 0;
}

// ─── Escrita ─────────────────────────────────────────────────────────────────

export async function createThread(input: {
  title: string;
  body: string;
  category?: string;
  authorKind?: AuthorKind;
  authorName: string;
  authorEmail?: string | null;
  sourceArticleSlug?: string | null;
  status?: PostStatus;
  moderationReason?: string | null;
}): Promise<Thread> {
  requireDb();
  const rows = (await sql`
    INSERT INTO forum_threads
      (slug, title, body, category, author_kind, author_name, author_email,
       source_article_slug, status, moderation_reason)
    VALUES (
      ${slugify(input.title)}, ${input.title}, ${input.body},
      ${input.category ?? "Geral"}, ${input.authorKind ?? "human"},
      ${input.authorName}, ${input.authorEmail ?? null},
      ${input.sourceArticleSlug ?? null}, ${input.status ?? "pending"},
      ${input.moderationReason ?? null}
    )
    RETURNING *
  `) as Thread[];
  return rows[0];
}

export async function createReply(input: {
  threadId: number;
  parentId?: number | null;
  body: string;
  authorKind?: AuthorKind;
  authorName: string;
  authorEmail?: string | null;
  status?: PostStatus;
  moderationReason?: string | null;
}): Promise<Reply> {
  requireDb();
  const rows = (await sql`
    INSERT INTO forum_replies
      (thread_id, parent_id, body, author_kind, author_name, author_email, status, moderation_reason)
    VALUES (
      ${input.threadId}, ${input.parentId ?? null}, ${input.body},
      ${input.authorKind ?? "human"}, ${input.authorName}, ${input.authorEmail ?? null},
      ${input.status ?? "pending"}, ${input.moderationReason ?? null}
    )
    RETURNING *
  `) as Reply[];

  // contador e ordenação do feed só avançam quando a resposta é pública
  if ((input.status ?? "pending") === "published") {
    await sql`
      UPDATE forum_threads
      SET reply_count = reply_count + 1, last_activity_at = NOW()
      WHERE id = ${input.threadId}
    `;
  }
  return rows[0];
}

export async function createPoll(input: {
  threadId: number;
  question: string;
  options: string[];
  closesAt?: Date | null;
}): Promise<void> {
  requireDb();
  const polls = (await sql`
    INSERT INTO forum_polls (thread_id, question, closes_at)
    VALUES (${input.threadId}, ${input.question}, ${input.closesAt ?? null})
    RETURNING id
  `) as { id: number }[];
  const pollId = polls[0].id;
  for (let i = 0; i < input.options.length; i++) {
    await sql`
      INSERT INTO forum_poll_options (poll_id, label, position)
      VALUES (${pollId}, ${input.options[i]}, ${i})
    `;
  }
}

/** Voto idempotente: reclicar o mesmo valor remove o voto (toggle). */
export async function castVote(input: {
  targetKind: "thread" | "reply";
  targetId: number;
  voterKey: string;
  value: 1 | -1;
}): Promise<number> {
  requireDb();
  const existing = (await sql`
    SELECT value FROM forum_votes
    WHERE target_kind = ${input.targetKind} AND target_id = ${input.targetId}
      AND voter_key = ${input.voterKey}
    LIMIT 1
  `) as { value: number }[];

  if (existing[0]?.value === input.value) {
    await sql`
      DELETE FROM forum_votes
      WHERE target_kind = ${input.targetKind} AND target_id = ${input.targetId}
        AND voter_key = ${input.voterKey}
    `;
  } else {
    await sql`
      INSERT INTO forum_votes (target_kind, target_id, voter_key, value)
      VALUES (${input.targetKind}, ${input.targetId}, ${input.voterKey}, ${input.value})
      ON CONFLICT (target_kind, target_id, voter_key)
      DO UPDATE SET value = EXCLUDED.value
    `;
  }

  // recalcula a partir dos votos reais em vez de incrementar — não acumula erro
  const agg = (await sql`
    SELECT COALESCE(SUM(value), 0)::int AS score FROM forum_votes
    WHERE target_kind = ${input.targetKind} AND target_id = ${input.targetId}
  `) as { score: number }[];
  const score = agg[0].score;

  if (input.targetKind === "thread") {
    await sql`UPDATE forum_threads SET score = ${score} WHERE id = ${input.targetId}`;
  } else {
    await sql`UPDATE forum_replies SET score = ${score} WHERE id = ${input.targetId}`;
  }
  return score;
}

export async function castPollVote(input: {
  pollId: number;
  optionId: number;
  voterKey: string;
}): Promise<boolean> {
  requireDb();
  const inserted = (await sql`
    INSERT INTO forum_poll_votes (poll_id, option_id, voter_key)
    VALUES (${input.pollId}, ${input.optionId}, ${input.voterKey})
    ON CONFLICT (poll_id, voter_key) DO NOTHING
    RETURNING id
  `) as { id: number }[];
  if (inserted.length === 0) return false; // já votou nessa enquete
  await sql`
    UPDATE forum_poll_options SET vote_count = vote_count + 1 WHERE id = ${input.optionId}
  `;
  return true;
}

// ─── Teto de custo da IA ─────────────────────────────────────────────────────

export interface AiUsage {
  threads_created: number;
  replies_created: number;
  moderations_run: number;
}

export async function getTodayAiUsage(): Promise<AiUsage> {
  if (!forumConfigured) return { threads_created: 999, replies_created: 999, moderations_run: 999 };
  const rows = (await sql`
    SELECT threads_created, replies_created, moderations_run
    FROM forum_ai_usage WHERE day = CURRENT_DATE
  `) as AiUsage[];
  return rows[0] ?? { threads_created: 0, replies_created: 0, moderations_run: 0 };
}

export async function recordAiUsage(input: {
  threads?: number;
  replies?: number;
  moderations?: number;
  inputTokens?: number;
  outputTokens?: number;
}): Promise<void> {
  if (!forumConfigured) return;
  await sql`
    INSERT INTO forum_ai_usage
      (day, threads_created, replies_created, moderations_run, input_tokens, output_tokens)
    VALUES (
      CURRENT_DATE, ${input.threads ?? 0}, ${input.replies ?? 0},
      ${input.moderations ?? 0}, ${input.inputTokens ?? 0}, ${input.outputTokens ?? 0}
    )
    ON CONFLICT (day) DO UPDATE SET
      threads_created = forum_ai_usage.threads_created + EXCLUDED.threads_created,
      replies_created = forum_ai_usage.replies_created + EXCLUDED.replies_created,
      moderations_run = forum_ai_usage.moderations_run + EXCLUDED.moderations_run,
      input_tokens    = forum_ai_usage.input_tokens    + EXCLUDED.input_tokens,
      output_tokens   = forum_ai_usage.output_tokens   + EXCLUDED.output_tokens
  `;
}

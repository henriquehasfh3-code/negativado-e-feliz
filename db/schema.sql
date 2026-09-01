-- Fórum "Negativado e Feliz" — schema inicial
-- Identidade é fraca de propósito (nome + e-mail, sem senha), então os dados do
-- autor ficam desnormalizados no próprio post. Não existe tabela de "usuário"
-- porque não existe usuário autenticado — fingir que existe seria pior.

CREATE TABLE IF NOT EXISTS forum_threads (
  id            BIGSERIAL PRIMARY KEY,
  slug          TEXT        NOT NULL UNIQUE,
  title         TEXT        NOT NULL,
  body          TEXT        NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'Geral',

  -- 'human' = leitor, 'ai' = robô do fórum, 'admin' = você
  author_kind   TEXT        NOT NULL DEFAULT 'human'
                            CHECK (author_kind IN ('human','ai','admin')),
  author_name   TEXT        NOT NULL,
  author_email  TEXT,

  -- quando a IA abre tópico a partir de um artigo do blog
  source_article_slug TEXT,

  -- 'pending' é o default: nada aparece sem passar pela triagem
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','published','rejected','hidden')),
  moderation_reason TEXT,

  is_pinned     BOOLEAN     NOT NULL DEFAULT FALSE,
  reply_count   INTEGER     NOT NULL DEFAULT 0,
  score         INTEGER     NOT NULL DEFAULT 0,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id            BIGSERIAL PRIMARY KEY,
  thread_id     BIGINT      NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  -- resposta encadeada; NULL = resposta direta ao tópico
  parent_id     BIGINT      REFERENCES forum_replies(id) ON DELETE CASCADE,

  body          TEXT        NOT NULL,
  author_kind   TEXT        NOT NULL DEFAULT 'human'
                            CHECK (author_kind IN ('human','ai','admin')),
  author_name   TEXT        NOT NULL,
  author_email  TEXT,

  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','published','rejected','hidden')),
  moderation_reason TEXT,

  score         INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Voto sem conta: voter_key é hash de IP + user-agent + salt do servidor.
-- Não impede fraude determinada, só o clique repetido casual — e isso é o
-- máximo honesto que dá pra fazer sem login.
CREATE TABLE IF NOT EXISTS forum_votes (
  id            BIGSERIAL PRIMARY KEY,
  target_kind   TEXT        NOT NULL CHECK (target_kind IN ('thread','reply')),
  target_id     BIGINT      NOT NULL,
  voter_key     TEXT        NOT NULL,
  value         SMALLINT    NOT NULL CHECK (value IN (-1, 1)),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (target_kind, target_id, voter_key)
);

CREATE TABLE IF NOT EXISTS forum_polls (
  id            BIGSERIAL PRIMARY KEY,
  thread_id     BIGINT      NOT NULL UNIQUE REFERENCES forum_threads(id) ON DELETE CASCADE,
  question      TEXT        NOT NULL,
  closes_at     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_poll_options (
  id            BIGSERIAL PRIMARY KEY,
  poll_id       BIGINT      NOT NULL REFERENCES forum_polls(id) ON DELETE CASCADE,
  label         TEXT        NOT NULL,
  position      INTEGER     NOT NULL DEFAULT 0,
  vote_count    INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS forum_poll_votes (
  id            BIGSERIAL PRIMARY KEY,
  poll_id       BIGINT      NOT NULL REFERENCES forum_polls(id) ON DELETE CASCADE,
  option_id     BIGINT      NOT NULL REFERENCES forum_poll_options(id) ON DELETE CASCADE,
  voter_key     TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, voter_key)
);

-- Teto de custo da IA. Sem isso, um cron com bug vira conta aberta na Anthropic.
CREATE TABLE IF NOT EXISTS forum_ai_usage (
  day             DATE     PRIMARY KEY,
  threads_created INTEGER  NOT NULL DEFAULT 0,
  replies_created INTEGER  NOT NULL DEFAULT 0,
  moderations_run INTEGER  NOT NULL DEFAULT 0,
  input_tokens    BIGINT   NOT NULL DEFAULT 0,
  output_tokens   BIGINT   NOT NULL DEFAULT 0
);

-- Índices para as consultas que a listagem do fórum realmente faz
CREATE INDEX IF NOT EXISTS idx_threads_feed
  ON forum_threads (status, is_pinned DESC, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_category
  ON forum_threads (category, status, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_article
  ON forum_threads (source_article_slug) WHERE source_article_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_replies_thread
  ON forum_replies (thread_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_replies_parent
  ON forum_replies (parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_votes_target
  ON forum_votes (target_kind, target_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll
  ON forum_poll_options (poll_id, position);
